import { CryptoCurves, KeyFormats, PublicKey } from '@baf-wallet/interfaces';
import { formatKey, NearAccount } from '@baf-wallet/multi-chain';
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
  const near = await NearAccount.get();
  const accountName = near.getAccountNameFromPubkey(pubkey, curve);
  const x = NearPublicKey.fromString(
    formatKey(derivedEd25519Pubkey, KeyFormats.bs58)
  );
  await near.accountCreator.createAccount(
    accountName,
    NearPublicKey.fromString(formatKey(derivedEd25519Pubkey, KeyFormats.bs58))
  );
}
