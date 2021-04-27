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
import {
  getWrappedInterface,
  pkFromSk,
  signMsg,
  skFromRng,
  skFromSeed,
} from '@baf-wallet/multi-chain';
import { createNearAccount } from './near';
import { Account } from 'near-api-js';
import { constants } from '../config/constants';
import { getBafContract, setBafContract } from '@baf-wallet/baf-contract';
import {
  createUserVerifyMessage,
  encodeBytes,
  formatBytes,
} from '@baf-wallet/utils';
import {
  NearChainInterface,
  NearState,
  WrappedNearChainInterface,
} from '@baf-wallet/near';
import { getNearChain } from '../chains/singletons';

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

const aliceUserId = 'alice';
const accountName = 'alicehere';

jest.setTimeout(30000);

async function deleteAccount(
  account: Account,
  assert = false,
  beneficiary = constants.chainInitParams[Chain.NEAR].masterAccountID
) {
  const ret = await account.deleteAccount(beneficiary);
  if (assert) expect(Object.keys(ret.status)[0]).toEqual('SuccessValue');
}

async function getAliceWrappedNear() {
  const nearAlice = await getWrappedInterface<NearChainInterface>(Chain.NEAR, {
    ...constants.chainInitParams[Chain.NEAR],
    keyPath: null,
    masterAccountID: accountName,
  });
  return nearAlice;
}

describe('createAccount', () => {
  let near: WrappedNearChainInterface;
  let masterAccount: Account;

  beforeAll(async () => {
    // NearAccount.setConfigNode(constants.nearAccountConfig);
    near = await getWrappedInterface<NearChainInterface>(Chain.NEAR, {
      ...constants.chainInitParams[Chain.NEAR],
    });

    masterAccount = await near.accounts.lookup(
      constants.chainInitParams[Chain.NEAR].masterAccountID
    );
    await setBafContract(masterAccount);

    await near;
    const nearAlice = await getAliceWrappedNear();
    const account = await nearAlice.accounts.lookup(accountName);
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
    const msg = createUserVerifyMessage(aliceUserId, aliceNonce.toString());
    const edSig = signMsg(aliceEdSecretKey, msg);
    console.log(edSig, edSig.length);
    const secpSig = signMsg(aliceSecpSecretKey, msg);
    const encodeSecpSigBafContract = signMsg(aliceSecpSecretKey, msg, true);

    await createNearAccount(
      aliceSecpPublicKey,
      aliceEdPublicKey,
      aliceUserId,
      aliceNonce,
      formatBytes(secpSig),
      formatBytes(encodeSecpSigBafContract),
      formatBytes(edSig),
      accountName
    );

    const nearAlice = await getAliceWrappedNear();

    const account = await nearAlice.accounts.lookup(accountName);
    expect(account).toBeTruthy();

    const msgDelete = createUserVerifyMessage(
      aliceUserId,
      await getBafContract().getAccountNonce(aliceSecpPublicKey)
    );
    const secpSigNew = signMsg(
      aliceSecpSecretKey,
      encodeBytes(msgDelete, Encoding.HEX),
      true
    );
    await getBafContract().deleteAccountInfo(
      aliceSecpPublicKey,
      aliceUserId,
      secpSigNew
    );
    await deleteAccount(account, true);
  });

  it('should fail if the secp sig is invalid', async () => {
    expect(async () => {
      const aliceNonce = 1;
      const msg = createUserVerifyMessage(aliceUserId, aliceNonce.toString());

      //* use random SK instead of alice's SK
      const edSig = signMsg(aliceEdSecretKey, msg);
      const secpSig = signMsg(skFromRng(secp256k1Marker), msg);
      const secpSigEncodedContract = signMsg(
        skFromRng(secp256k1Marker),
        msg,
        true
      );

      await createNearAccount(
        aliceSecpPublicKey,
        aliceEdPublicKey,
        aliceUserId,
        aliceNonce.toString(),
        formatBytes(secpSig),
        formatBytes(secpSigEncodedContract),
        formatBytes(edSig),
        accountName
      );
    }).rejects.toThrow(
      'Proof that the sender owns this public key must provided'
    );
  });

  it('should fail if the ed sig is invalid', async () => {
    expect(async () => {
      const aliceNonce = 1;
      const msg = createUserVerifyMessage(aliceUserId, aliceNonce.toString());

      //* use random SK instead of alice's SK
      const edSig = signMsg(skFromRng(ed25519Marker), msg);
      const secpSig = signMsg(aliceSecpSecretKey, msg);
      const secpSigEncodedContract = signMsg(aliceSecpSecretKey, msg, true);

      await createNearAccount(
        aliceSecpPublicKey,
        aliceEdPublicKey,
        aliceUserId,
        aliceNonce.toString(),
        formatBytes(secpSig),
        formatBytes(secpSigEncodedContract),
        formatBytes(edSig),
        accountName
      );
    }).rejects.toThrow(
      'Proof that the sender owns this public key must provided'
    );
  });
});
