(global as any).window = {
  name: 'nodejs',
};
window.name = 'nodejs';

import {
  Encoding,
  secp256k1,
  ed25519,
  secp256k1,
  secp256k1Marker,
  ed25519Marker,
} from '@baf-wallet/interfaces';
import {
  pkFromSk,
  signMsg,
  skFromRng,
  skFromSeed,
  skFromSeed,
} from '@baf-wallet/multi-chain';
import { createNearAccount } from './near';
import { Account } from 'near-api-js';
import { constants } from '../config/constants';
import {
  encodeSecpSigBafContract,
  getBafContract,
  setBafContract,
} from '@baf-wallet/baf-contract';
import {
  createUserVerifyMessage,
  encodeBytes,
  formatBytes,
  skFromString,
} from '@baf-wallet/utils';

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

jest.setTimeout(30000);

async function deleteAccount(
  account: Account,
  assert = false,
  beneficiary = constants.nearAccountConfig.masterAccountId
) {
  const ret = await account.deleteAccount(beneficiary);
  if (assert) expect(Object.keys(ret.status)[0]).toEqual('SuccessValue');
}

describe('createAccount', () => {
  let accountName: string;
  let nearAccount: NearAccount;

  beforeAll(async () => {
    NearAccount.setConfigNode(constants.nearAccountConfig);
    nearAccount = await NearAccount.get();
    await setBafContract(nearAccount.masterAccount);

    accountName = 'alicehere';
    await nearAccount.updateKeyPair(accountName, aliceEdSecretKey);

    const account = await nearAccount.near.account(accountName);
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
    const edSig = signMsg(aliceEdSecretKey, encodeBytes(msg, Encoding.HEX));
    console.log(edSig, edSig.length);
    const secpSig = signMsg(aliceSecpSecretKey, encodeBytes(msg, Encoding.HEX));

    await createNearAccount(
      aliceSecpPublicKey,
      aliceEdPublicKey,
      aliceUserId,
      aliceNonce,
      formatBytes(secpSig),
      encodeSecpSigBafContract(secpSig),
      formatBytes(edSig),
      accountName
    );

    const account = await nearAccount.near.account(accountName);
    expect(account).toBeTruthy();
    await nearAccount.updateKeyPair(accountName, aliceEdSecretKey);

    const msgDelete = createUserVerifyMessage(
      aliceUserId,
      await getBafContract().getAccountNonce(aliceSecpPublicKey)
    );
    const secpSigNew = signMsg(
      aliceSecpSecretKey,
      encodeBytes(msgDelete, Encoding.HEX)
    );
    await getBafContract().deleteAccountInfo(
      aliceSecpPublicKey,
      aliceUserId,
      encodeSecpSigBafContract(secpSigNew)
    );
    await deleteAccount(account, true);
  });

  it('should fail if the secp sig is invalid', async () => {
    expect(async () => {
      const aliceNonce = 1;
      const msg = createUserVerifyMessage(
        aliceUserId,
        aliceNonce.toString()
      );

      //* use random SK instead of alice's SK
      const edSig = signMsg(aliceEdSecretKey, msg)
      const secpSig = signMsg(skFromRng(secp256k1Marker), msg);

      await createNearAccount(
        aliceSecpPublicKey,
        aliceEdPublicKey,
        aliceUserId,
        aliceNonce.toString(),
        secpSig,
        secpSig.s.toString('hex'),
        edSig,
        accountName,
      );
    }).rejects.toThrow(
      'Proof that the sender owns this public key must provided'
    );

    const account = await nearAccount.near.account(accountName);
    expect(account).toBeTruthy();
    await nearAccount.updateKeyPair(accountName, aliceEdSecretKey);

    expect(deleteAccount(account, true)).rejects.toThrow(
      `Can not sign transactions for account ${accountName} on network ${account.connection.networkId}, no matching key pair found`
    );
  });

  it('should fail if the ed sig is invalid', async () => {
    expect(async () => {
      const aliceNonce = 1;
      const msg = ChainUtil.createUserVerifyMessage(
        aliceUserId,
        aliceNonce.toString()
      );

      //* use random SK instead of alice's SK
      const edSig = ChainUtil.signEd25519(edSKFromRng(), msg);
      const secpSig = ChainUtil.signSecp256k1(aliceSecpSecretKey, msg);

      await createNearAccount(
        aliceSecpPublicKey,
        aliceEdPublicKey,
        aliceUserId,
        aliceNonce.toString(),
        secpSig.toDER('hex'),
        edSig,
        accountName,
        CryptoCurves.secp256k1
      );
    }).rejects.toThrow(
      'Proof that the sender owns this public key must provided'
    );

    const account = await nearAccount.near.account(accountName);
    expect(account).toBeTruthy();
    await nearAccount.updateKeyPair(accountName, aliceEdSecretKey);

    expect(deleteAccount(account, true)).rejects.toThrow(
      `Can not sign transactions for account ${accountName} on network ${account.connection.networkId}, no matching key pair found`
    );
  });
});
