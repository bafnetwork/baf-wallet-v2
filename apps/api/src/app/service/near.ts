import { CryptoCurves, PublicKey } from '@baf-wallet/interfaces';
import { NearAccountSingelton } from '@baf-wallet/multi-chain';
import { PublicKey as NearPublicKey } from 'near-api-js/lib/utils';

// Check the found public key verifies the signature produced by (nonce + userId)
export async function createNearAccount(
  pubkey: PublicKey,
  derivedEd25519Pubkey: PublicKey,
  curve = CryptoCurves.secp256k1
) {
  if (curve !== CryptoCurves.secp256k1) {
    throw 'Only secp256k1 curves are currently supported';
  }
  const near = await NearAccountSingelton.get();
  await near.accountCreator.createAccount(
    near.getAccountNameFromPubkey(pubkey, curve),
    new NearPublicKey(derivedEd25519Pubkey)
  );
}
