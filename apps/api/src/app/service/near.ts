import { CryptoCurves, Envs, getNearNetworkId, NearNetworkId } from '@baf-wallet/interfaces';
import { NearAccountSingelton } from '@baf-wallet/multi-chain';
import { PublicKey } from 'near-api-js/lib/utils';

// Or should we do local
// const masterAccount = new Account()
// const accountCreator = new LocalAccountCreator();

// TODO: put into constants

const defaultNearConfig = {
  masterAccountId: 'levtester.testnet',
  connectConfig: {
    networkId: getNearNetworkId(Envs.DEV),
    nodeUrl: 'https://rpc.testnet.near.org',
    keyPath: '/home/lev/.near-credentials/testnet/levtester.testnet.json',
    explorerUrl: 'https://explorer.testnet.near.org',
    masterAccount: 'levtester.testnet'
  },
};

// Check the found public key verifies the signature produced by (nonce + userId)
export async function createNearAccount(
  pubkey: string,
  derivedEd25519Pubkey: string,
  curve = CryptoCurves.secp256k1
) {
  console.log(window === undefined)
  if (curve !== CryptoCurves.secp256k1) {
    throw 'Only secp256k1 curves are currently supported';
  }
  NearAccountSingelton.setConfig(defaultNearConfig);
  const near = await NearAccountSingelton.get();
  await near.masterAccount.createAccount(
    near.getAccountNameFromPubkey(pubkey, curve),
    PublicKey.fromString(derivedEd25519Pubkey),
    '10000000000000000000'
  )
  // await masterAccount.createAccount(
  //   near.getAccountNameFromPubkey(pubkey, curve),
  //   PublicKey.fromString(derivedEd25519Pubkey),
  //   '10000000000000000000'
  // );
}
