import { ChainInterface } from '@baf-wallet/interfaces';
import {
  Account,
  connect,
  ConnectConfig,
  KeyPair as NearKeyPair,
  Near,
  transactions,
  utils as NearUtils,
} from 'near-api-js';
import {
  NearAccountID,
  nearAccounts,
  NearCreateAccountParams,
} from './accounts';
import { nearConverter } from './converter';

export type NearNetworkID = 'devnet' | 'testnet' | 'mainnet';

type NearSendTxOpts = 'TODO';
type NearSendResult = 'TODO';
type NearSignTxOpts = 'TODO';

export type NearChainInterface = ChainInterface<
  NearUtils.PublicKey,
  Buffer,
  NearKeyPair,
  NearInitParams,
  Near,
  transactions.Transaction,
  transactions.SignedTransaction,
  NearSignTxOpts,
  NearSendTxOpts,
  NearSendResult,
  Account,
  NearAccountID,
  NearCreateAccountParams
>;

export const nearInterface: NearChainInterface = {
  accounts: nearAccounts,
  convert: nearConverter,
};

export interface NearInitParams {
  networkID: NearNetworkID;
  masterAccountID: NearAccountID;
  keyPath?: string;
}

async function init({
  networkID,
  masterAccountID,
  keyPath,
}: NearInitParams): Promise<Near> {
  const connectConfig = {
    networkId: networkID,
    nodeUrl: `https://rpc.${networkID}.near.org`,
    helperUrl: `https://helper.${networkID}.near.org`,
    masterAccount: masterAccountID,
    keyPath,
  };
  return await connect(connectConfig);
}
