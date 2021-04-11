(global as any).window = {
  name: 'nodejs',
};
window.name = 'nodejs';
import { CryptoCurves, Envs, getNearNetworkId } from '@baf-wallet/interfaces';
import { NearAccountSingelton } from '@baf-wallet/multi-chain';
import { createNearAccount } from './near';
import * as bs58 from 'bs58';
import { Account } from 'near-api-js';
import { KeyPairEd25519 } from 'near-api-js/lib/utils';

const secp256k1Pubkey = 'BfaBf538323A1D21453b5F6a374A07867D867196'; // TODO: derive from torus
(global as any).window = {
  name: 'nodejs',
};

const alicePubkey = bs58.encode(
  Buffer.from('emnAJc96ms/Da6K/Wu2AVm8NXPhdbUBohwMOYKTQ1Eo=', 'base64')
);
const aliceSecret = bs58.encode(
  Buffer.from(
    '7zlbvQqMGvGpe0cBTpXGJH9HZmxPT3acA+/l/7xN69d6acAlz3qaz8Nror9a7YBWbw1c+F1tQGiHAw5gpNDUSg==',
    'base64'
  )
);

jest.setTimeout(30000);

async function deleteAccount(
  account: Account,
  assert = false,
  beneficiary = defaultNearConfig.masterAccountId
) {
  const ret = await account.deleteAccount(beneficiary);
  if (assert) {
    expect(Object.keys(ret.status)[0]).toEqual('SuccessValue');
  }
}

describe('Create a dummy near account on the testnet', () => {
  let accountName: string;
  let nearAccount: NearAccountSingelton;
  beforeAll(async () => {
    NearAccountSingelton.setConfig(defaultNearConfig);
    nearAccount = await NearAccountSingelton.get();
    accountName = nearAccount.getAccountNameFromPubkey(
      secp256k1Pubkey,
      CryptoCurves.secp256k1
    );
    nearAccount.updateKeyPair(accountName, new KeyPairEd25519(aliceSecret));

    const account = await nearAccount.near.account(accountName);
    try {
      await deleteAccount(account);
    } catch (e) {}
  });
  it('should create the account', async () => {
    await createNearAccount(secp256k1Pubkey, alicePubkey);
    const account = await nearAccount.near.account(accountName);
    expect(account).toBeTruthy();
    await deleteAccount(account, true);
  });
});
