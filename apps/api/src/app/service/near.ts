import { CryptoCurves, NearNetworkId } from '@baf-wallet/interfaces';
import { NearAccountSingelton } from '@baf-wallet/multi-chain';

// Or should we do local
// const masterAccount = new Account()
// const accountCreator = new LocalAccountCreator();

// TODO: put into constants

const defaultNearConfig = {
  masterAccountId: 'levtest.testnet',
  connectConfig: {
    networkId: NearNetworkId.DEVNET,
    nodeUrl: 'https://rpc.testnet.near.org',
    keyPath: '/home/lev/.near-credentials/testnet/levtester.testnet.json',
  },
};

// Check the found public key verifies the signature produced by (nonce + userId) 
export async function createNearAccount(
  pubkey: string,
  curve = CryptoCurves.secp256k1
) {
  if (curve !== CryptoCurves.secp256k1) {
    throw 'Only secp256k1 curves are currently supported';
  }
  NearAccountSingelton.setConfig(defaultNearConfig);
  const near = await NearAccountSingelton.get();
  await near.masterAccount.createAccount(
    near.getAccountNameFromPubkey(pubkey, curve),
    pubkey,
    '10000000000000000000'
  );
}
