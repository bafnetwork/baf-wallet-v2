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
export interface NEP141Contract extends NearContract {
  // TODO: fill in, see https://github.com/bafnetwork/baf-wallet-v2/issues/69
  ft_balance_of: (args: { account_id: NearAccountID }) => Promise<string>;
  ft_total_supply: () => Promise<string>;
  storage_balance_of: (args: { account_id: NearAccountID }) => Promise<string>;
  // 1 Yocto Near is the standard accepted attached deposit for ft_transfer
  ft_transfer: (
    args: {
      receiver_id: NearAccountID;
      amount: string;
      memo?: string;
    },
    gas: string,
    attachedDeposit: string
  ) => Promise<void>;
}

type contractViewMethod = (args: any) => Promise<any>;
type contractChangeMethod = (
  args: any,
  gas?: string,
  attachedDeposit?: string
) => Promise<any>;

/**
 * End definitions for standard Near Contracts
 */
export type NearContract = {
  [fn_name: string]: contractViewMethod | contractChangeMethod;
};

export interface NearInitContractParams {
  callerAccount?: Account;
  viewMethods: string[];
  changeMethods: string[];
}

export const initContract = (nearMasterAccount: Account, contractAccountID) => async <Contract>(
  params: NearInitContractParams
) => {
  const contract = new NearNativeContract(
    params.callerAccount ?? nearMasterAccount,
    contractAccountID,
    {
      viewMethods: params.viewMethods,
      changeMethods: params.changeMethods,
    }
  );
  return (contract as unknown) as Contract;
};

export function getContract<Contract, ContractInitParams>(
  nearState: NearState,
  contractAccountID: string
) {
  return {
    init: initContract(nearState.nearMasterAccount, contractAccountID)
  }
}
