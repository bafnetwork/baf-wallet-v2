import {
  ChainInterface,
  ed25519,
  Encoding,
  InferWrapChainInterface,
  KeyPair,
  secp256k1,
} from '@baf-wallet/interfaces';
import {
  Account,
  connect,
  ConnectConfig,
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
import { InMemoryKeyStore } from 'near-api-js/lib/key_stores';
import { KeyPairEd25519 as NearKeyPairEd25519 } from 'near-api-js/lib/utils';

export type { NearAccountID, NearCreateAccountParams } from './accounts';
export type WrappedNearChainInterface = InferWrapChainInterface<NearChainInterface>;

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
  nearMasterAccount: Account;
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
  keyPair?: KeyPair<ed25519>;
}

async function init({
  networkID,
  masterAccountID,
  keyPath,
  keyPair,
}: NearInitParams): Promise<NearState> {
  const nodeUrl = `https://rpc.${networkID}.near.org`;
  const connectConfig = {
    networkId: networkID,
    nodeUrl,
    helperUrl: `https://helper.${networkID}.near.org`,
    masterAccount: masterAccountID,
    keyPath,
  } as ConnectConfig;
  if (keyPair) {
    const keyStore = new InMemoryKeyStore();
    const nearKp = new NearKeyPairEd25519(keyPair.sk.format(Encoding.BS58));
    keyStore.setKey(networkID, masterAccountID, nearKp);
    connectConfig.deps = {
      keyStore: keyStore,
    };
    connectConfig.keyStore = keyStore;
  } else if (keyPath) {
    const keyStore = new InMemoryKeyStore();
    connectConfig.deps = {
      keyStore: keyStore,
    };
  } else {
    throw 'A key path or key pair must be provided';
  }

  const near = await connect(connectConfig);

  return {
    near,
    networkID,
    rpcProvider: new providers.JsonRpcProvider(nodeUrl),
    nearMasterAccount: await near.account(masterAccountID),
  };
}
