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

export async function getWrappedInterface<T>(
  chain: Chain,
  initParams: InferInitParams<T>
): Promise<InferWrapChainInterface<T>> {
  const chainInterface = getChainInterface<T>(chain);
  return await wrapChainInterface(chainInterface, initParams);
}

export function getChainInterface<T>(chain: Chain): InferChainInterface<T> {
  switch (chain) {
    case Chain.near:
      return nearChainInterface;
    default:
      throw new Error(`Unsupported chain ${chain}`);
  }
}

export async function wrapChainInterface<T>(
  unwrapped: InferChainInterface<T>,
  initParams: InferInitParams<T>
): Promise<InferWrapChainInterface<T>> {
  const innerSdk: InferInner<T> = await (unwrapped.init(initParams) as Promise<
    InferInner<T>
  >);

  const wrapped = {
    rpc: unwrapped.rpc(innerSdk),
    tx: unwrapped.tx(innerSdk),
    accounts: unwrapped.accounts(innerSdk),
    convert: unwrapped.convert,
  };

  return wrapped as InferWrapChainInterface<T>;
}
