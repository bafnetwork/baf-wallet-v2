import { BafError } from '@baf-wallet/errors';
import { Chain } from '@baf-wallet/interfaces';
import { nearToYoctoNear } from '@baf-wallet/near';

export function formatAmountToIndivisibleUnit(
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
