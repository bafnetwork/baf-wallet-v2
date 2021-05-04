import { BafError } from '@baf-wallet/errors';
import {
  InferChainInterface,
  Chain,
  InferInner,
  InferWrapChainInterface,
  InferInitParams,
} from '@baf-wallet/interfaces';
import { nearChainInterface } from '@baf-wallet/near';

// these are kind of ugly, but the ugly should be limited to here, all in the pursuit of typed-ness and editor completions

// NOTE: This will return the wrong type if you put in a type paramteter that conflicts with the 'chain' argument
export async function getWrappedInterface<T>(
  chain: Chain,
  initParams: InferInitParams<T>
): Promise<InferWrapChainInterface<T>> {
  const chainInterface = getChainInterface<T>(chain);
  return await wrapChainInterface(chainInterface, initParams);
}

// NOTE: This will return the wrong type if you put in a type paramter that conflicts with the 'chain' argument
export function getChainInterface<T>(chain: Chain): InferChainInterface<T> {
  switch (chain) {
    case Chain.NEAR:
      return nearChainInterface as InferChainInterface<T>;
    default:
      throw BafError.UnsupportedChain(chain);
  }
}

export async function wrapChainInterface<T>(
  unwrapped: InferChainInterface<T>,
  initParams: InferInitParams<T>
): Promise<InferWrapChainInterface<T>> {
  const innerSdk = await (unwrapped.init(initParams) as Promise<InferInner<T>>);

  const wrapped = {
    rpc: unwrapped.rpc(innerSdk),
    tx: unwrapped.tx(innerSdk),
    accounts: unwrapped.accounts(innerSdk),
    convert: unwrapped.convert,
    getConstants: unwrapped.getConstants,

    // Note: in the future, some chainInterfaces might want to do stuff in this fn
    getInner: () => innerSdk,
  };

  return wrapped as InferWrapChainInterface<T>;
}
