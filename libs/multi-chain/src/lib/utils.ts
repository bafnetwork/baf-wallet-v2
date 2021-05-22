import { BafError } from '@baf-wallet/errors';
import { Chain } from '@baf-wallet/interfaces';
import { nearToYoctoNear } from '@baf-wallet/near';
import BN from 'bn.js';

export function formatTokenAmountToIndivisibleUnit(
  amount: number,
  decimals: number
): string {
  const expStr = `${1}${new Array(decimals).fill('0').join('')}`;
  const exp = new BN(expStr);
  console.log(exp.muln(amount), amount);
  return exp.muln(amount).toString(10);
}

export function formatNativeTokenAmountToIndivisibleUnit(
  amount: number,
  chain: Chain
): string {
  switch (chain) {
    case Chain.NEAR:
      return nearToYoctoNear(amount);
    default:
      throw BafError.UnsupportedChain(chain);
  }
}
