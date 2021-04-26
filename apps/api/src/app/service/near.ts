import { CryptoCurves, KeyFormats, PublicKey } from '@baf-wallet/interfaces';
import { formatKey, NearAccount } from '@baf-wallet/multi-chain';
import { PublicKey as NearPublicKey } from 'near-api-js/lib/utils';
import { ChainUtil } from '@baf-wallet/multi-chain';
import { getBafContract } from '@baf-wallet/baf-contract';

// Check the found public key verifies the signature produced by (nonce + userId)
export async function createNearAccount(
  secpPK: PublicKey,
  edPK: PublicKey,
  userId: string,
  nonce: string,
  secpSig: string,
  rustEncodedSecpSig: string,
  edSig: string,
  accountID: string,
  curve = CryptoCurves.secp256k1
) {
  const msg = ChainUtil.createUserVerifyMessage(userId, nonce);
  const sigsValid = verifyBothSigs(msg, secpSig, edSig, secpPK, edPK);

  if (!sigsValid) {
    throw 'Proof that the sender owns this public key must provided';
  }

  if (curve !== CryptoCurves.secp256k1) {
    throw 'Only secp256k1 curves are currently supported';
  }

  const near = await NearAccount.get();

  const bafContract = await getBafContract();
  await bafContract.setAccountInfo(
    secpPK,
    userId,
    [...Buffer.from(rustEncodedSecpSig, 'hex')],
    accountID
  );

  await near.accountCreator.createAccount(
    accountID,
    NearPublicKey.fromString(formatKey(edPK, KeyFormats.BS58))
  );
}

export async function getAccountNonceFromSecpPK(
  secpPK: PublicKey
): Promise<string> {
  return await getBafContract().getAccountNonce(secpPK);
}

export async function getAccountInfoFromSecpPK(
  secpPK: PublicKey
) {
  return {
    near_id: await getBafContract().getAccountId(secpPK)
  }
}

function verifyBothSigs(
  msg: string,
  secpSig: string,
  edSig: string,
  secpPubkey: PublicKey,
  edPubkey: PublicKey
): boolean {
  return (
    ChainUtil.verifySignedSecp256k1(secpPubkey, msg, secpSig) &&
    ChainUtil.verifySignedEd25519(edPubkey, msg, edSig)
  );
}
