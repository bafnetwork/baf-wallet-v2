import {
  AccountsInterface,
  Balance,
  Chain,
  ContractInterface,
  ed25519,
  secp256k1,
} from '@baf-wallet/interfaces';
import { Account, Account as NearAccount, Contract } from 'near-api-js';
import {
  AccountCreator,
  UrlAccountCreator,
  LocalAccountCreator,
} from 'near-api-js/lib/account_creator';
import BN from 'bn.js';

import { PublicKey } from '@baf-wallet/interfaces';
import { NearState } from './near';
import { nearConverter } from './convert';
import { BafError } from '@baf-wallet/errors';

export type NearAccountID = string;

export interface NearInitContractParams {
  contractName: string;
  viewMethods: string[];
  changeMethods: string[];
}

export interface NearCallContractParams {
  methodName: string;
  callParams: any;
}

export function nearContract(
  nearState: NearState
): ContractInterface<Contract, NearInitContractParams, NearCallContractParams> {
  return {
    init: async (params) =>
      new Contract(nearState.nearMasterAccount, params.contractName, {
        viewMethods: params.viewMethods,
        changeMethods: params.changeMethods,
      }),
    call: async <T>(contract, params) => {
      return (await (contract as any)[params.methodName](
        params.callParams
      )) as T;
    },
  };
}
