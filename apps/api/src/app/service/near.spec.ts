(global as any).window = {
  name: 'nodejs',
};
window.name = 'nodejs';
import {
  CryptoCurves,
  Envs,
  getNearNetworkId,
} from '@baf-wallet/interfaces';
import { NearAccountSingelton } from '@baf-wallet/multi-chain';
import { createNearAccount } from './near';
import { Account } from 'near-api-js';

const secp256k1Pubkey = Buffer.from(
  'BfaBf538323A1D21453b5F6a374A07867D867196',
  'hex'
); // TODO: derive from torus
(global as any).window = {
  name: 'nodejs',
};

const defaultNearConfig = {
  masterAccountId: 'levtester.testnet',
  connectConfig: {
    networkId: getNearNetworkId(Envs.DEV),
    nodeUrl: 'https://rpc.testnet.near.org',
    keyPath: '/home/lev/.near-credentials/testnet/levtester.testnet.json',
    explorerUrl: 'https://explorer.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    masterAccount: 'levtester.testnet',
  },
};

const alicePubkey = Buffer.from(
  'emnAJc96ms/Da6K/Wu2AVm8NXPhdbUBohwMOYKTQ1Eo=',
  'base64'
);
const aliceSecret = Buffer.from(
  '7zlbvQqMGvGpe0cBTpXGJH9HZmxPT3acA+/l/7xN69d6acAlz3qaz8Nror9a7YBWbw1c+F1tQGiHAw5gpNDUSg==',
  'base64'
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
    nearAccount.updateKeyPair(
      accountName,
      aliceSecret
    );

    const account = await nearAccount.near.account(accountName);
    try {
      await deleteAccount(account);
    } catch (e) {
      console.log("Not deleting account, continuing")
    }
  });
  it('should create the account', async () => {
    await createNearAccount(secp256k1Pubkey, alicePubkey);
    const account = await nearAccount.near.account(accountName);
    expect(account).toBeTruthy();
    await deleteAccount(account, true);
  });
});
