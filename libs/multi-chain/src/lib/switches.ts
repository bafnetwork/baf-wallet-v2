import {
  WrappedChainInterface,
  ChainInterface,
  InferChainInterface,
  Chain,
  InferInner,
  InferWrapChainInterface,
  InferInitParams,
} from '@baf-wallet/interfaces';
import { nearChainInterface } from '@baf-wallet/near';

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
    case Chain.near:
      return nearChainInterface as InferChainInterface<T>;
    default:
      throw new Error(`Unsupported chain ${chain}`);
  }
}

// this is kind of ugly, but the ugly should be limited to here
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

    // Note: in the future, some chainInterfaces might want to do stuff in this fn
    getInner: () => innerSdk,
  };

  return wrapped as InferWrapChainInterface<T>;
}
