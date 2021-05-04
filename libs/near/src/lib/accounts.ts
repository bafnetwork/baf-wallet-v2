import {
  AccountsInterface,
  Balance,
  Chain,
  ed25519,
  secp256k1,
} from '@baf-wallet/interfaces';
import { Account as NearAccount } from 'near-api-js';
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
      };
    },
    create: async ({
      accountID,
      newAccountPk,
      initialBalance,
      method = 'helper',
    }: NearCreateAccountParams): Promise<NearAccount> => {
      if (method === 'local' && !initialBalance) {
        throw BafError.MissingInitBalance(Chain.NEAR)
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
