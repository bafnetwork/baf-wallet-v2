import { Account, Contract } from 'near-api-js';
import ContractConfig from '../../config.json';
import { AccountId, PublicKey, RustEncodedSecpSig } from '@baf-wallet/interfaces';
import { formatKeyArray } from '@baf-wallet/multi-chain';
import { ec } from 'elliptic';

interface BafContract {
  getAccountId: (secp_pk: PublicKey) => Promise<AccountId>;
  getAccountNonce: (secp_pk: PublicKey) => Promise<string>;
  setAccountInfo: (
    secp_pk: PublicKey,
    user_id: string,
    secp_sig_s: RustEncodedSecpSig,
    new_account_id: AccountId
  ) => Promise<void>;
  deleteAccountInfo: (
    secp_pk: PublicKey,
    user_id: string,
    secp_sig_s: RustEncodedSecpSig
  ) => Promise<void>;
}

let bafContract: BafContract;

export async function setBafContract(account): Promise<BafContract> {
  bafContract = await buildBafContract(account);
  return bafContract;
}

export function getBafContract(): BafContract {
  if (bafContract) return bafContract;
  throw 'BAF Contract is not initialized yet, please call setBafContract';
}

async function buildBafContract(account: Account): Promise<BafContract> {
  const contract = new Contract(account, ContractConfig.contractName, {
    viewMethods: ['get_account_id', 'get_account_nonce'],
    changeMethods: ['set_account_info', 'delete_account_info'],
  });
  return {
    getAccountId: (secp_pk: PublicKey) =>
      (contract as any).get_account_id({
        secp_pk: formatKeyArray(secp_pk),
      }) as Promise<AccountId>,
    getAccountNonce: (secp_pk: PublicKey) =>
      (contract as any).get_account_nonce({
        secp_pk: formatKeyArray(secp_pk),
      }) as Promise<string>,
    setAccountInfo: (secp_pk, user_id, secp_sig_s, new_account_id) =>
      (contract as any).set_account_info({
        user_id,
        secp_pk: formatKeyArray(secp_pk),
        secp_sig_s: [...Buffer.from(secp_sig_s, 'hex')],
        new_account_id,
      }),
    deleteAccountInfo: (secp_pk, user_id, secp_sig_s) =>
      (contract as any).delete_account_info({
        user_id,
        secp_pk: formatKeyArray(secp_pk),
        secp_sig_s: [...Buffer.from(secp_sig_s, 'hex')],
      }),
  };
}

export function encodeSecpSigBafContract(sig): string {
  return sig.r.toString('hex', 64) + sig.s.toString('hex', 64);
}
