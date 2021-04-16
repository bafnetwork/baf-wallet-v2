<script lang="ts">
  import type { Balance } from '../../interfaces';
  import { ChainName } from '@baf-wallet/interfaces'
  
  import { formatNearAmount as nearFormat } from 'near-api-js/lib/utils/format';

  export let bal: Balance;
  function getStrFormatted(): string {
    switch (bal.tok) {
      case ChainName.ETH:
        return '0';
      case ChainName.NEAR:
        console.log(bal)
        return nearFormat(bal.balance.toString());
      // TODO: for we can use whatever standard there may be for the following
      // We could end up using a library like the folliwing https://www.npmjs.com/package/ethereum-libraries-token
      default:
        throw 'Unsupported token';
    }
  }
</script>

<span>
  {getStrFormatted()}&nbsp;
  {bal.tok}
</span>
