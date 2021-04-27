import { ChainInterface, InferWrapChainInterface, WrappedChainInterface } from '@baf-wallet/interfaces';
import {
  Account,
  connect,
  KeyPair as NearKeyPair,
  Near,
  providers,
  transactions,
  utils as NearUtils,
} from 'near-api-js';

import { NearBuildTxParams, NearSignTxOpts, nearTx } from './tx';
import { nearRpc, NearSendOpts, NearSendResult } from './rpc';
import {
  NearAccountID,
  nearAccounts,
  NearCreateAccountParams,
} from './accounts';
import { nearConverter } from './convert';
import { NearNetworkID } from './utils';

export type WrappedNearChainInterface = InferWrapChainInterface<NearChainInterface>

export type NearChainInterface = ChainInterface<
  NearUtils.PublicKey,
  Buffer,
  NearKeyPair,
  NearInitParams,
  NearState,
  transactions.Transaction,
  NearBuildTxParams,
  transactions.SignedTransaction,
  NearSignTxOpts,
  NearSendOpts,
  NearSendResult,
  Account,
  NearAccountID,
  NearCreateAccountParams
>;

export interface NearState {
  near: Near;
  rpcProvider: providers.JsonRpcProvider;
  networkID: NearNetworkID;
}

export const nearChainInterface: NearChainInterface = {
  accounts: nearAccounts,
  tx: nearTx,
  convert: nearConverter,
  rpc: nearRpc,
  init,
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
}: NearInitParams): Promise<NearState> {
  const nodeUrl = `https://rpc.${networkID}.near.org`;
  const connectConfig = {
    networkId: networkID,
    nodeUrl,
    helperUrl: `https://helper.${networkID}.near.org`,
    masterAccount: masterAccountID,
    keyPath,
  };

  const near = await connect(connectConfig);

  return {
    near,
    networkID,
    rpcProvider: new providers.JsonRpcProvider(nodeUrl),
  };
}
