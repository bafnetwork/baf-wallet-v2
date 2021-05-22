<script lang="ts">
  import { Chain, Balance } from '@baf-wallet/interfaces';
  import { BafError } from '@baf-wallet/errors';
  import { TokenInfo } from '@baf-wallet/chain-info';

  import { formatNearAmount as nearFormat } from 'near-api-js/lib/utils/format';

  export let bal: Balance;

  export let chain: string;
  export let isNativeToken: boolean = true;
  export let tokenInfo: TokenInfo;

  export let fracDigits = 10;

  function trimTrailing(s: string) {
    return s.replace(/\.?0*$/, '');
  }

  function getStrFormatted(): string {
    if (isNativeToken)
      switch (chain) {
        case Chain.NEAR:
          return nearFormat(bal.toString(), fracDigits);
        // TODO: for we can use whatever standard there may be for the following
        // We could end up using a library like the folliwing https://www.npmjs.com/package/ethereum-libraries-token
        default:
          throw BafError.UnsupportedToken(chain);
      }

    const wholeStr = bal.substring(0, bal.length - tokenInfo.decimals) || '0';
    const fracStrTrailingZeros = bal
      .substring(bal.length - tokenInfo.decimals)
      .padStart(tokenInfo.decimals, '0')
      .substring(0, fracDigits);
    return trimTrailing(`${wholeStr}.${fracStrTrailingZeros}`);
  }
</script>

<span>
  {`${getStrFormatted()} ${tokenInfo.symbol}`}
</span>
