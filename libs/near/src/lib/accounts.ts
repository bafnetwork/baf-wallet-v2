import {
  AccountsInterface,
  Balance,
  Chain,
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
import { createTokenContract } from './utils';

export type NearAccountID = string;

const NEP141ViewMethods = [
  'ft_balance_of',
  'ft_total_supply',
  'storage_balance_of',
];
const NEP141ChangeMethods = [
  'ft_transfer',
  'ft_transfer_call',
  'storage_deposit',
];

export function nearAccounts(
  nearState: NearState
): AccountsInterface<NearAccount, NearAccountID, NearCreateAccountParams> {
  const { near } = nearState;
  return {
    lookup: async (accountID: NearAccountID): Promise<NearAccount> =>
      await near.account(accountID),

    getGenericMasterAccount: () => {
      return {
        getBalance: async () =>
          (await nearState.nearMasterAccount.getAccountBalance())
            .total as Balance,
        getContractTokenBalance: async (
          contractName: string
        ): Promise<string> => {
          const contract = createTokenContract(
            nearState.nearMasterAccount,
            contractName,
            NEP141ViewMethods,
            NEP141ChangeMethods
          );
          return await (contract as any).ft_balance_of({
            account_id: nearState.nearMasterAccount.accountId,
          });
        },
      };
    },
    create: async ({
      accountID,
      newAccountPk,
      initialBalance,
      method = 'helper',
    }: NearCreateAccountParams): Promise<NearAccount> => {
      if (method === 'local' && !initialBalance) {
        throw BafError.MissingInitBalance(Chain.NEAR);
      }
      const masterAccount = await near.account(near.config.masterAccount);
      const accountCreator: AccountCreator =
        method === 'helper'
          ? new UrlAccountCreator(near.connection, near.config.helperUrl)
          : new LocalAccountCreator(masterAccount, initialBalance);

      await accountCreator.createAccount(
        accountID,
        nearConverter.pkFromUnified(newAccountPk)
      );
      return await near.account(accountID);
    },
  };
}

export interface NearCreateAccountParams {
  accountID: NearAccountID;
  newAccountPk: PublicKey<ed25519 | secp256k1>;
  initialBalance?: BN;
  method?: 'helper' | 'local';
}
