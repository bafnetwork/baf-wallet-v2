(global as any).window = {
  name: 'nodejs',
};
window.name = 'nodejs';

import { CryptoCurves, KeyFormats } from '@baf-wallet/interfaces';
import {
  edPubkeyFromSK,
  NearAccount,
  secpPubkeyFromSK,
  secpSKFromSeed,
  edSKFromSeed,
  edSKFromRng,
  secpSKFromRng,
} from '@baf-wallet/multi-chain';
import { createNearAccount } from './near';
import { Account } from 'near-api-js';
import { constants } from '../config/constants';
import { ChainUtil } from '@baf-wallet/multi-chain';

(global as any).window = {
  name: 'nodejs',
};

const seed = new Uint8Array(
  Buffer.from(
    'af4391c50ca34de55165ffbfcd9e43a846a37ef97905988b694ba886d23c05d5',
    'hex'
  )
);

const aliceEdSecretKey = edSKFromSeed(seed);
const aliceSecpSecretKey = secpSKFromSeed(seed);

const aliceEdPublicKey = edPubkeyFromSK(aliceEdSecretKey);
const aliceSecpPublicKey = secpPubkeyFromSK(aliceSecpSecretKey);

const aliceUserId = 'alice';
const aliceNonce = 69;

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
    NearAccount.setConfig(constants.nearAccountConfig);
    nearAccount = await NearAccount.get();

    accountName = await nearAccount.getAccountNameFromPubkey(
      aliceSecpPublicKey,
      CryptoCurves.secp256k1
    );
    await nearAccount.updateKeyPair(accountName, aliceEdSecretKey);

    const account = await nearAccount.near.account(accountName);
    try {
      await deleteAccount(account);
    } catch (e) {
      console.log('Not deleting account with error, continuing');
    }
  });

  it('should create the account given good sigs', async () => {
    const msg = ChainUtil.createUserVerifyMessage(
      aliceUserId,
      aliceNonce.toString()
    );
    const edSig = ChainUtil.signEd25519(aliceEdSecretKey, msg);
    const secpSig = ChainUtil.signSecp256k1(aliceSecpSecretKey, msg);

    await createNearAccount(
      aliceSecpPublicKey,
      aliceEdPublicKey,
      aliceUserId,
      aliceNonce.toString(),
      secpSig,
      edSig,
      CryptoCurves.secp256k1
    );

    const account = await nearAccount.near.account(accountName);
    expect(account).toBeTruthy();
    await nearAccount.updateKeyPair(accountName, aliceEdSecretKey);
    await deleteAccount(account, true);
  });

  it('should fail if the secp sig is invalid', async () => {
    expect(async () => {
      const msg = ChainUtil.createUserVerifyMessage(
        aliceUserId,
        aliceNonce.toString()
      );

      //* use random SK instead of alice's SK
      const edSig = ChainUtil.signEd25519(aliceEdSecretKey, msg);
      const secpSig = ChainUtil.signSecp256k1(secpSKFromRng(), msg);

      await createNearAccount(
        aliceSecpPublicKey,
        aliceEdPublicKey,
        aliceUserId,
        aliceNonce.toString(),
        secpSig,
        edSig,
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

  it('should fail if the ed sig is invalid', async () => {
    expect(async () => {
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
        secpSig,
        edSig,
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
