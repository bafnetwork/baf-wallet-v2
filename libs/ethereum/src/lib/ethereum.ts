import {
  ChainInterface,
  ed25519,
  Encoding,
  InferWrapChainInterface,
  KeyPair,
} from '@baf-wallet/interfaces';

import * as ethers from 'ethers'

import { EthereumBuildTxParams, NearSignTxOpts, nearTx } from './tx';
import { getConstants } from './constants';
import {
  initContract,
  NearInitContractParams,
  NEP141Contract,
} from './contract';
import { nearRpc, NearSendOpts, NearSendResult } from './rpc';
import {
  NearAccountID,
  nearAccounts,
  NearCreateAccountParams,
} from './accounts';
import { nearConverter } from './convert';
import { BafError } from '@baf-wallet/errors';
import { getContract } from './contract';
import { SigningKey } from '@ethersproject/signing-key';

export type { NearAccountID, NearCreateAccountParams } from './accounts';
export type {
  NearTransaction,
  EthereumBuildTxParams as NearBuildTxParams,
  NearAction,
  NearSupportedActionTypes,
} from './tx';
export type WrappedNearChainInterface = InferWrapChainInterface<EthereumChainInterface>;

export type EthereumChainInterface = ChainInterface<
  string,
  string,
  SigningKey,
  NearInitParams,
  EthereumState,
  ethers.UnsignedTransaction,
  EthereumBuildTxParams,
  ethers.Transaction,
  NearSignTxOpts,
  NearSendOpts,
  NearSendResult,
  any,
  string,
  {},
  {}
>;

export interface EthereumState {
  
}

export const nearChainInterface: EthereumChainInterface = {
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
}: NearInitParams): Promise<EthereumState> {
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
