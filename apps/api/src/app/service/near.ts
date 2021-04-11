import { CryptoCurves, Envs, getNearNetworkId } from '@baf-wallet/interfaces';
import { NearAccountSingelton } from '@baf-wallet/multi-chain';
import { PublicKey } from 'near-api-js/lib/utils';

// Check the found public key verifies the signature produced by (nonce + userId)
export async function createNearAccount(
  pubkey: string,
  derivedEd25519Pubkey: string,
  curve = CryptoCurves.secp256k1
) {
  if (curve !== CryptoCurves.secp256k1) {
    throw 'Only secp256k1 curves are currently supported';
  }
  const near = await NearAccountSingelton.get();
  await near.accountCreator.createAccount(
    near.getAccountNameFromPubkey(pubkey, curve),
    PublicKey.fromString(derivedEd25519Pubkey)
  );
}
