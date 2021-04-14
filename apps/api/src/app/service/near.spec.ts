(global as any).window = {
  name: 'nodejs',
};
window.name = 'nodejs';
import { CryptoCurves, KeyFormats } from '@baf-wallet/interfaces';
import {
  ed25519PubkeyFromSecret,
  formatKey,
  NearAccount,
  secp256k1PubkeyFromSecret,
  secretFromSeed,
} from '@baf-wallet/multi-chain';
import { createNearAccount } from './near';
import { Account } from 'near-api-js';
import { constants } from '../config/constants';

(global as any).window = {
  name: 'nodejs',
};

const aliceSecret = secretFromSeed(
  new Uint8Array([
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
  ])
);

const aliceEd25519Pubkey = ed25519PubkeyFromSecret(aliceSecret);
const aliceSecp256k1Pubkey = secp256k1PubkeyFromSecret(aliceSecret);


jest.setTimeout(30000);

async function deleteAccount(
  account: Account,
  assert = false,
  beneficiary = constants.nearAccountConfig.masterAccountId
) {
  const ret = await account.deleteAccount(beneficiary);
  if (assert) expect(Object.keys(ret.status)[0]).toEqual('SuccessValue');
}

describe('Create a dummy near account on the testnet', () => {
  let accountName: string;
  let nearAccount: NearAccount;
  beforeAll(async () => {
    NearAccount.setConfig(constants.nearAccountConfig);
    nearAccount = await NearAccount.get();

    accountName = nearAccount.getAccountNameFromPubkey(
      aliceSecp256k1Pubkey,
      CryptoCurves.secp256k1
    );
    await nearAccount.updateKeyPair(accountName, aliceSecret);

    const account = await nearAccount.near.account(accountName);
    try {
      await deleteAccount(account);
    } catch (e) {
      console.log('Not deleting account with error, continuing');
    }
  });
  it('should create the account', async () => {
    await createNearAccount(aliceSecp256k1Pubkey, aliceEd25519Pubkey);
    const account = await nearAccount.near.account(accountName);
    expect(account).toBeTruthy();
    await nearAccount.updateKeyPair(accountName, aliceSecret);
    await deleteAccount(account, true);
  });
});
