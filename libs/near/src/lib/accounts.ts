import {
  AccountsInterface,
  ed25519,
  secp256k1,
} from '@baf-wallet/interfaces';
import {
  Account as NearAccount,
} from 'near-api-js';
import {
  AccountCreator,
  UrlAccountCreator,
  LocalAccountCreator,
} from 'near-api-js/lib/account_creator';
import BN from 'bn.js';

import { PublicKey } from '@baf-wallet/interfaces';
import { NearState } from './near';
import { nearConverter } from './convert';

export type NearAccountID = string;

export function nearAccounts(
  nearState: NearState
): AccountsInterface<NearAccount, NearAccountID, NearCreateAccountParams> {
  const { near } = nearState;
  return {
    lookup: async (accountID: NearAccountID): Promise<NearAccount> =>
      await near.account(accountID),

    create: async ({
      accountID,
      payerPk,
      initialBalance,
      method = 'helper',
    }: NearCreateAccountParams): Promise<NearAccount> => {
      const masterAccount = await near.account(near.config.masterAccount);
      const accountCreator: AccountCreator =
        method === 'helper'
          ? new UrlAccountCreator(near.connection, near.config.helperUrl)
          : new LocalAccountCreator(masterAccount, initialBalance);

      await accountCreator.createAccount(
        accountID,
        nearConverter.pkFromUnified(payerPk)
      );
      return await near.account(accountID);
    },
  };
}

export interface NearCreateAccountParams {
  accountID: NearAccountID;
  payerPk: PublicKey<ed25519 | secp256k1>;
  initialBalance: BN;
  method: 'helper' | 'local';
}