<script lang="ts">
  import { Chain, ChainBalance } from '@baf-wallet/interfaces';

  import { formatNearAmount as nearFormat } from 'near-api-js/lib/utils/format';

  export let bal: ChainBalance;
  function getStrFormatted(): string {
    switch (bal.chain) {
      case Chain.NEAR:
        return nearFormat(bal.balance.toString());
      // TODO: for we can use whatever standard there may be for the following
      // We could end up using a library like the folliwing https://www.npmjs.com/package/ethereum-libraries-token
      default:
        throw 'Unsupported token';
    }
  }
</script>

<span>
  {`${getStrFormatted()} ${bal.chain}`}
</span>
