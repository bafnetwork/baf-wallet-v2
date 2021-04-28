import {
  ed25519,
  Encoding,
  PublicKey,
  secp256k1,
} from '@baf-wallet/interfaces';
import { PublicKey as NearPublicKey } from 'near-api-js/lib/utils';
import { getBafContract } from '@baf-wallet/baf-contract';
import {
  createUserVerifyMessage,
  encodeBytes,
  formatBytes,
  pkToString,
} from '@baf-wallet/utils';
import { verifySignature } from '@baf-wallet/multi-chain';
import { getNearChain } from '../chains/singletons';

// Check the found public key verifies the signature produced by (nonce + userId)
export async function createNearAccount(
  secpPK: PublicKey<secp256k1>,
  edPK: PublicKey<ed25519>,
  userId: string,
  nonce: string,
  secpSig: string,
  rustEncodedSecpSig: string,
  edSig: string,
  accountID: string
) {
  const msg = createUserVerifyMessage(userId, nonce);
  const sigsValid = verifyBothSigs(msg, secpSig, edSig, secpPK, edPK);

  if (!sigsValid) {
    throw 'Proof that the sender owns this public key must provided';
  }

  const near = await getNearChain();

  const nearAccount = near.accounts;
  await nearAccount.create({
    accountID,
    newAccountPk: edPK,
  });

  const bafContract = await getBafContract();
  await bafContract.setAccountInfo(
    secpPK,
    userId,
    encodeBytes(rustEncodedSecpSig, Encoding.HEX),
    accountID
  );
}

export async function getAccountNonce(
  pk: PublicKey<secp256k1>
): Promise<string> {
  return await getBafContract().getAccountNonce(pk);
}

export async function getAccountInfoFromSecpPK(pk: PublicKey<secp256k1>) {
  return {
    near_id: await getBafContract().getAccountId(pk),
  };
}

function verifyBothSigs(
  msg: string,
  secpSig: string,
  edSig: string,
  secpPubkey: PublicKey<secp256k1>,
  edPubkey: PublicKey<ed25519>
): boolean {
  return (
    verifySignature(
      secpPubkey,
      msg,
      encodeBytes(secpSig, Encoding.HEX)
    ) &&
    verifySignature(
      edPubkey,
      msg,
      encodeBytes(edSig, Encoding.HEX)
    )
  );
}
