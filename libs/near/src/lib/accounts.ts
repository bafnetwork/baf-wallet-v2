import {
  Encoding,
  SecretKey,
  AccountsInterface,
  ed25519,
  secp256k1,
} from '@baf-wallet/interfaces';
import {
  Account as NearAccount,
  connect,
  ConnectConfig,
  Near,
} from 'near-api-js';
import {
  AccountCreator,
  UrlAccountCreator,
  LocalAccountCreator,
} from 'near-api-js/lib/account_creator';
import BN from 'bn.js';
import { InMemoryKeyStore, KeyStore } from 'near-api-js/lib/key_stores';
import { PublicKey } from '@baf-wallet/interfaces';
import { KeyPairEd25519 } from 'near-api-js/lib/utils';
import { NearNetworkID } from './near';
import { nearConverter } from './converter';

export type NearAccountID = string;

export function nearAccounts(
  near: Near
): AccountsInterface<NearAccount, NearAccountID, NearCreateAccountParams> {
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
        nearConverter.pkFromBaf(payerPk)
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

interface NearAccountParamsInternal {
  masterAccountID: NearNetworkID;
  connectConfig: ConnectConfig;
}
