import { CryptoCurves, KeyFormats, PublicKey } from '@baf-wallet/interfaces';
import { formatKey, NearAccount } from '@baf-wallet/multi-chain';
import { PublicKey as NearPublicKey } from 'near-api-js/lib/utils';
import { ChainUtil } from '@baf-wallet/multi-chain';

// Check the found public key verifies the signature produced by (nonce + userId)
export async function createNearAccount(
  secpPK: PublicKey,
  edPK: PublicKey,
  userId: string,
  nonce: string,
  secpSig: string,
  edSig: string,
  accountID: string,
  curve = CryptoCurves.secp256k1
) {
  const msg = ChainUtil.createUserVerifyMessage(userId, nonce);
  const sigsValid = verifyBothSigs(msg, secpSig, edSig, secpPK, edPK);

  if (!sigsValid) {
    this.setStatus(403);
    throw 'Proof that the sender owns this public key must provided';
  }

  if (curve !== CryptoCurves.secp256k1) {
    throw 'Only secp256k1 curves are currently supported';
  }

  const near = await NearAccount.get();
  // const accountName = near.getAccountNameFromPubkey(secpPubkey, curve);
  try {
    await near.setAccountName(edPK, edSig, secpPK, secpSig, accountID, msg);
  } catch (e) {
    this.setStatus(500);
    throw e;
  }

  await near.accountCreator.createAccount(
    accountID,
    NearPublicKey.fromString(formatKey(edPK, KeyFormats.bs58))
  );
}

function verifyBothSigs(
  msg: string,
  secpSig: string,
  edSig: string,
  secpPubkey: PublicKey,
  edPubkey: PublicKey
): boolean {
  return (
    !ChainUtil.verifySignedSecp256k1(secpPubkey, msg, secpSig) ||
    !ChainUtil.verifySignedEd25519(edPubkey, msg, edSig)
  );
}
