import { Account, Contract, Near } from 'near-api-js';
import ContractConfig from '../../config.json';
import { ec as EC } from 'elliptic';
import {
  PublicKey,
  RustEncodedSecpSig,
  secp256k1,
} from '@baf-wallet/interfaces';
import { NearAccountID } from '@baf-wallet/near';
import { pkToArray, pkToString } from '@baf-wallet/utils';

interface BafContract {
  getAccountId: (pk: PublicKey<secp256k1>) => Promise<NearAccountID | null>;
  getAccountNonce: (secp_pk: PublicKey<secp256k1>) => Promise<string>;
  setAccountInfo: (
    secp_pk: PublicKey<secp256k1>,
    user_id: string,
    secp_sig_s: RustEncodedSecpSig,
    new_account_id: NearAccountID
  ) => Promise<void>;
  deleteAccountInfo: (
    secp_pk: PublicKey<secp256k1>,
    user_id: string,
    secp_sig_s: RustEncodedSecpSig
  ) => Promise<void>;
}

let bafContract: BafContract;

export async function setBafContract(account: Account): Promise<BafContract> {
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
    getAccountId: async (pk) => {

      const ret = await (contract as any).get_account_id({
        secp_pk: pkToArray(pk),
      }) 
      if (!ret || ret === '') return null
      else return ret as NearAccountID
      // as Promise<NearAccountID>,
    },
    getAccountNonce: (pk) =>
      (contract as any).get_account_nonce({
        secp_pk: pkToArray(pk),
      }) as Promise<string>,
    setAccountInfo: (pk, user_id, secp_sig_s, new_account_id) =>
      (contract as any).set_account_info({
        user_id,
        secp_pk: pkToArray(pk),
        secp_sig_s: [...secp_sig_s],
        new_account_id,
      }),
    deleteAccountInfo: (pk, user_id, secp_sig_s) =>
      (contract as any).delete_account_info({
        user_id,
        secp_pk: pkToArray(pk),
        secp_sig_s: [...secp_sig_s],
      }),
  };
}

export function encodeSecpSigBafContract(sig: EC.Signature): Buffer {
  return Buffer.from(
    `${sig.r.toString('hex', 64)}${sig.s.toString('hex', 64)}`,
    'hex'
  );
}
