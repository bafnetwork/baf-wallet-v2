import { Account, Contract } from 'near-api-js';
import ContractConfig from '../../config.json';
import { AccountId, PublicKey } from '@baf-wallet/interfaces';
import { formatKeyArray } from '@baf-wallet/multi-chain';

interface BafContract {
  getAccountId: (secp_pk: PublicKey) => Promise<AccountId>;
  getAccountNonce: (secp_pk: PublicKey) => Promise<string>;
  setAccountInfo: (
    secp_pk: PublicKey,
    secp_sig: number[],
    new_account_id: AccountId
  ) => Promise<void>;
}

export async function buildBafContract(account: Account): Promise<BafContract> {
  const contract = new Contract(account, ContractConfig.contractName, {
    viewMethods: ['get_account_id', 'get_account_nonce'],
    changeMethods: ['set_account_info'],
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
    setAccountInfo: (secp_pk, secp_sig, new_account_id) =>
      (contract as any).set_account_info({
        secp_pk: formatKeyArray(secp_pk),
        secp_sig,
        new_account_id,
      }),
  };
}
