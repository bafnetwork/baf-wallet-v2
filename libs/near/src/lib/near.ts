import {
  ChainInterface,
  ed25519,
  Encoding,
  InferWrapChainInterface,
  KeyPair,
  NearAccountID,
} from '@baf-wallet/interfaces';
import {
  Account,
  connect,
  ConnectConfig,
  KeyPair as NearKeyPair,
  Contract as NearNativeContract,
  Near,
  providers,
  transactions,
  utils as NearUtils,
} from 'near-api-js';

import { NearBuildTxParams, NearSignTxOpts, nearTx } from './tx';
import { getConstants } from './constants';
import {
  initContract,
  NearInitContractParams,
  NEP141Contract,
} from './contract';
import { nearRpc, NearSendOpts, NearSendResult } from './rpc';
import {
  nearAccounts,
  NearCreateAccountParams,
} from './accounts';
import { nearConverter } from './convert';
import { NearNetworkID } from './utils';
import { InMemoryKeyStore } from 'near-api-js/lib/key_stores';
import { KeyPairEd25519 as NearKeyPairEd25519 } from 'near-api-js/lib/utils';
import { BafError } from '@baf-wallet/errors';
import { getContract } from './contract';

export type {
  NearTransaction,
  NearBuildTxParams,
  NearAction,
  NearSupportedActionTypes,
} from './tx';
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
  NearCreateAccountParams,
  NearInitContractParams
>;

export interface NearState {
  near: Near;
  rpcProvider: providers.JsonRpcProvider;
  networkID: NearNetworkID;
  nearMasterAccount: Account;
  getFungibleTokenContract: (contractName: string) => Promise<NEP141Contract>;
}

export const nearChainInterface: NearChainInterface = {
  accounts: nearAccounts,
  tx: nearTx,
  convert: nearConverter,
  rpc: nearRpc,
  getConstants,
  init,
  getContract,
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
    throw BafError.MissingKeyPair();
  }

  const near = await connect(connectConfig);

  const nearMasterAccount = await near.account(masterAccountID);
  return {
    near,
    networkID,
    rpcProvider: new providers.JsonRpcProvider(nodeUrl),
    nearMasterAccount,
    getFungibleTokenContract: (contractAccountID: string) =>
      initContract(
        nearMasterAccount,
        contractAccountID
      )({
        viewMethods: ['ft_balance_of', 'ft_total_supply', 'storage_balance_of'],
        changeMethods: ['ft_transfer'],
      }),
  };
}
