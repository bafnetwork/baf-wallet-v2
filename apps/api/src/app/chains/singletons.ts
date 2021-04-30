import { Chain } from '@baf-wallet/interfaces';
import { getWrappedInterface } from '@baf-wallet/multi-chain';
import {
  NearChainInterface,
  WrappedNearChainInterface,
} from '@baf-wallet/near';
import { constants } from '../config/constants';

let nearChain: WrappedNearChainInterface;
let init = false;
export async function initChains() {
  nearChain = await getWrappedInterface<NearChainInterface>(
    Chain.NEAR,
    constants.chainParams[Chain.NEAR]
  );
  init = true;
}

export function getNearChain(): WrappedNearChainInterface {
  if (!init) throw new Error('You must first initialize the chains');
  return nearChain;
}
