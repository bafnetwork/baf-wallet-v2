import { CryptoCurves, KeyFormats, PublicKey } from '@baf-wallet/interfaces';
import { formatKey, NearAccount } from '@baf-wallet/multi-chain';
import { PublicKey as NearPublicKey } from 'near-api-js/lib/utils';
import { ChainUtil } from '@baf-wallet/multi-chain';
import { ec, eddsa } from 'elliptic';

// Check the found public key verifies the signature produced by (nonce + userId)
export async function createNearAccount(
  secpPubkey: PublicKey,
  edPubkey: PublicKey,
  userId: string,
  nonce: string,
  secpSig: string,
  edSig: string,
  curve = CryptoCurves.secp256k1
) {
  const sigsValid = verifyBothSigs(
    userId,
    nonce,
    secpSig,
    edSig,
    secpPubkey,
    edPubkey
  );

  if (!sigsValid) {
    this.setStatus(403);
    throw 'Proof that the sender owns this public key must provided';
  }

  if (curve !== CryptoCurves.secp256k1) {
    throw 'Only secp256k1 curves are currently supported';
  }

  const near = await NearAccount.get();
  const accountName = near.getAccountNameFromPubkey(secpPubkey, curve);

  await near.accountCreator.createAccount(
    accountName,
    NearPublicKey.fromString(formatKey(edPubkey, KeyFormats.bs58))
  );
}

function verifyBothSigs(
  userId: string,
  nonce: string,
  secpSig: string,
  edSig: string,
  secpPubkey: PublicKey,
  edPubkey: PublicKey
): boolean {
  const msg = ChainUtil.createUserVerifyMessage(userId, nonce);
  return (
    !ChainUtil.verifySignedSecp256k1(secpPubkey, msg, secpSig) ||
    !ChainUtil.verifySignedEd25519(edPubkey, msg, edSig)
  );
}

function toNearKey(edPubkey: PublicKey): NearPublicKey {
  const x = NearPublicKey.fromString(formatKey(edPubkey, KeyFormats.bs58));
  return x;
}
