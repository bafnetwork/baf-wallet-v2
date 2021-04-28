import { Chain, WrappedChainInterface } from '@baf-wallet/interfaces';
import { getWrappedInterface } from '@baf-wallet/multi-chain';
import { NearChainInterface, WrappedNearChainInterface } from '@baf-wallet/near';
import { constants } from '../config/constants';

// export interface NearInitParams {
//   networkID: NearNetworkID;
//   masterAccountID: NearAccountID;
//   keyPath?: string;
let nearChain : WrappedNearChainInterface;
let init = false
export async function initChains() {
  nearChain = await getWrappedInterface<NearChainInterface>(
    Chain.NEAR,
    constants.chainParams[Chain.NEAR]
  );
  init = true
}

export function getNearChain(): WrappedNearChainInterface {
  if (!init)
    throw "You must first initialize the chains"
  return nearChain;
}

// Type 'WrappedChainInterface<PublicKey, Buffer, KeyPair, NearState,
// Transaction, NearBuildTxParams, SignedTransaction, ... 5 more ..., NearCreateAccountParams>' is not assignable to type 'WrappedNearChainInterface'.
//   Type 'NearState' is missing the following properties from type 'ChainInterface<PublicKey, Buffer, KeyPair, NearInitParams, NearState, Transaction, NearBuildTxParams, ... 6 more ..., NearCreateAccountParams>': rpc, tx, accounts, init, convertts(2322)
