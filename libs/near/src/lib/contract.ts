import { ContractInterface } from '@baf-wallet/interfaces';
import {
  Account,
  Account as NearAccount,
  Contract as NearNativeContract,
  Near,
} from 'near-api-js';
import { NearAccountID } from './accounts';

import { NearState } from './near';

/**
 * The following are definitions for standard Near Contracts
 */
export interface NEP141Contract extends NearContractMethods {
  // TODO: fill in
  ft_balance_of: (args: { account_id: NearAccountID }) => Promise<string>;
  ft_total_supply: () => Promise<string>;
  storage_balance_of: (args: { account_id: NearAccountID }) => Promise<string>;
  ft_transfer: (args: {
    sender_id: NearAccountID;
    amount: string;
    memo?: string;
  }) => Promise<void>;
}

/**
 * End definitions for standard Near Contracts
 */
export type NearContractMethods = {
  [fn_name: string]: (args: any) => Promise<any>;
};

export interface NearInitContractParams {
  contractName: string;
  callerAccount?: Account;
  viewMethods: string[];
  changeMethods: string[];
}

export const initContract = (nearMasterAccount: Account) => async <
  ContractMethods extends NearContractMethods
>(
  params: NearInitContractParams
) => {
  const contract = new NearNativeContract(
    params.callerAccount ?? nearMasterAccount,
    params.contractName,
    {
      viewMethods: params.viewMethods,
      changeMethods: params.changeMethods,
    }
  );
  return (contract as unknown) as ContractMethods & NearNativeContract;
};

export function nearContract(
  nearState: NearState
): ContractInterface<
  NearNativeContract,
  NearContractMethods,
  NearInitContractParams
> {
  return {
    init: initContract(nearState.nearMasterAccount),
  };
}
