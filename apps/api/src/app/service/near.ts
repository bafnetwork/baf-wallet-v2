import {
  ed25519,
  Encoding,
  PublicKey,
  secp256k1,
} from '@baf-wallet/interfaces';
import { getBafContract } from '@baf-wallet/baf-contract';
import {
  createUserVerifyMessage,
  encodeBytes,
} from '@baf-wallet/utils';
import { verifySignature } from '@baf-wallet/crypto';
import { getNearChain } from '../chains/singletons';
import { BafError } from '@baf-wallet/errors';

export interface NearAccountInfo {
  near_id: string | null;
}

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
  if (!verifySignature(secpPK, msg, encodeBytes(secpSig, Encoding.HEX))) {
    throw BafError.InvalidSignature(secpPK);
  }
  if (!verifySignature(edPK, msg, encodeBytes(edSig, Encoding.HEX))) {
    throw BafError.InvalidSignature(edPK);
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

export async function getAccountInfoFromSecpPK(
  pk: PublicKey<secp256k1>
): Promise<NearAccountInfo> {
  return {
    near_id: await getBafContract().getAccountId(pk),
  };
}
