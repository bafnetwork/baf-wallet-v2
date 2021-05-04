<script lang="ts">
  import { Chain, Balance } from '@baf-wallet/interfaces';
  import { BafError } from '@baf-wallet/errors';

  import { formatNearAmount as nearFormat } from 'near-api-js/lib/utils/format';

  export let bal: Balance;
  export let chain: Chain
  function getStrFormatted(): string {
    switch (chain) {
      case Chain.NEAR:
        return nearFormat(bal.toString());
      // TODO: for we can use whatever standard there may be for the following
      // We could end up using a library like the folliwing https://www.npmjs.com/package/ethereum-libraries-token
      default:
        throw BafError.UnsupportedToken(chain);
    }
  }
</script>

<span>
  {`${getStrFormatted()} ${chain}`}
</span>
