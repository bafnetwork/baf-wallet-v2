(global as any).window = {
  name: 'nodejs',
};
window.name = 'nodejs';

import {
  Encoding,
  ed25519,
  secp256k1,
  secp256k1Marker,
  ed25519Marker,
  Chain,
} from '@baf-wallet/interfaces';
import { getWrappedInterface } from '@baf-wallet/multi-chain';
import {
  keyPairFromSk,
  pkFromSk,
  signMsg,
  skFromRng,
  skFromSeed,
} from '@baf-wallet/crypto';
import { createNearAccount } from './near';
import { Account, KeyPair } from 'near-api-js';
import { constants } from '../config/constants';
import { getBafContract, setBafContract } from '@baf-wallet/baf-contract';
import { createUserVerifyMessage, formatBytes } from '@baf-wallet/utils';
import {
  NearChainInterface,
  NearState,
  WrappedNearChainInterface,
} from '@baf-wallet/near';
import { getNearChain, initChains } from '../chains/singletons';

(global as any).window = {
  name: 'nodejs',
};

const seed = new Uint8Array(
  Buffer.from(
    'af4391c50ca34de55165ffbfcd9e43a846a37ef97905988b694ba886d23c05d5',
    'hex'
  )
);

const aliceEdSecretKey = skFromSeed(seed, ed25519Marker);
const aliceSecpSecretKey = skFromSeed(seed, secp256k1Marker);

const aliceEdPublicKey = pkFromSk(aliceEdSecretKey);
const aliceSecpPublicKey = pkFromSk(aliceSecpSecretKey);

const aliceAccountName = 'alice_35.testnet';

jest.setTimeout(30000);

async function deleteAccount(
  account: Account,
  assert = false,
  beneficiary = constants.chainParams[Chain.NEAR].masterAccountID
) {
  const ret = await account.deleteAccount(beneficiary);
  if (assert) expect(Object.keys(ret.status)[0]).toEqual('SuccessValue');
}

async function getAliceWrappedNear() {
  const nearAlice = await getWrappedInterface<NearChainInterface>(Chain.NEAR, {
    ...constants.chainParams[Chain.NEAR],
    keyPath: null,
    masterAccountID: aliceAccountName,
    keyPair: keyPairFromSk(aliceEdSecretKey),
  });
  return nearAlice;
}

describe('createAccount', () => {
  let near: WrappedNearChainInterface;
  let masterAccount: Account;

  beforeAll(async () => {
    await initChains();
    near = await getWrappedInterface<NearChainInterface>(Chain.NEAR, {
      ...constants.chainParams[Chain.NEAR],
    });

    masterAccount = await near.accounts.lookup(
      constants.chainParams[Chain.NEAR].masterAccountID
    );
    await setBafContract(masterAccount);

    await near;
    const nearAlice = await getAliceWrappedNear();
    const account = await nearAlice.accounts.lookup(aliceAccountName);
    try {
      await deleteAccount(account);
    } catch (e) {
      console.log('Not deleting account with error, continuing');
    }
  });

  it('should create the account given good sigs', async () => {
    const aliceNonce = await getBafContract().getAccountNonce(
      aliceSecpPublicKey
    );
    const msg = createUserVerifyMessage(
      aliceAccountName,
      aliceNonce.toString()
    );
    const edSig = signMsg(aliceEdSecretKey, msg);
    const secpSig = signMsg(aliceSecpSecretKey, msg);
    const encodeSecpSigBafContract = signMsg(aliceSecpSecretKey, msg, true);

    await createNearAccount(
      aliceSecpPublicKey,
      aliceEdPublicKey,
      aliceAccountName,
      aliceNonce,
      formatBytes(secpSig),
      formatBytes(encodeSecpSigBafContract),
      formatBytes(edSig),
      aliceAccountName
    );

    const nearAlice = await getAliceWrappedNear();

    const account = await nearAlice.accounts.lookup(aliceAccountName);
    expect(account).toBeTruthy();

    const msgDelete = createUserVerifyMessage(
      aliceAccountName,
      await getBafContract().getAccountNonce(aliceSecpPublicKey)
    );
    const secpSigNew = signMsg(aliceSecpSecretKey, msgDelete, true);
    await getBafContract().deleteAccountInfo(
      aliceSecpPublicKey,
      aliceAccountName,
      secpSigNew
    );
    await deleteAccount(account, true);
  });

  it('should fail if the secp sig is invalid', async () => {
    const aliceNonce = 1;
    const msg = createUserVerifyMessage(
      aliceAccountName,
      aliceNonce.toString()
    );

    //* use random SK instead of alice's SK
    const edSig = signMsg(aliceEdSecretKey, msg);
    const secpSig = signMsg(skFromRng(secp256k1Marker), msg);
    const secpSigEncodedContract = signMsg(
      skFromRng(secp256k1Marker),
      msg,
      true
    );

    try {
      await createNearAccount(
        aliceSecpPublicKey,
        aliceEdPublicKey,
        aliceAccountName,
        aliceNonce.toString(),
        formatBytes(secpSig),
        formatBytes(secpSigEncodedContract),
        formatBytes(edSig),
        aliceAccountName
      );
      fail('Should have thrown');
    } catch (e) {
      expect(e).toEqual(
        new Error(
          'An invalid signature has been provided for 048bae7823327488f14ced4f0c4051701683c33d69820b775efdd3494aecd971eba0bd9f155c69a9d8d4f5f3904f89e7e2e3964930840d7089c25561f3bb6576bc'
        )
      );
    }
  });

  it('should fail if the ed sig is invalid', async () => {
    const aliceNonce = 1;
    const msg = createUserVerifyMessage(
      aliceAccountName,
      aliceNonce.toString()
    );

    //* use random SK instead of alice's SK
    const edSig = signMsg(skFromRng(ed25519Marker), msg);
    const secpSig = signMsg(aliceSecpSecretKey, msg);
    const secpSigEncodedContract = signMsg(aliceSecpSecretKey, msg, true);

    try {
      await createNearAccount(
        aliceSecpPublicKey,
        aliceEdPublicKey,
        aliceAccountName,
        aliceNonce.toString(),
        formatBytes(secpSig),
        formatBytes(secpSigEncodedContract),
        formatBytes(edSig),
        aliceAccountName
      );
      fail('Should have thrown');
    } catch (e) {
      expect(e).toEqual(
        new Error(
          'An invalid signature has been provided for cefa19930aabad85846f541b33d94bc18e433919dcc672c1e6944109de9a467f'
        )
      );
    }
  });
});
