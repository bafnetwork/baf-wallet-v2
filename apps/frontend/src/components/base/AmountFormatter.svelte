<script lang="ts">
  import type { Balance } from '@baf-wallet/interfaces';
  import { TOKEN } from '@baf-wallet/interfaces';
  import { formatNearAmount as nearFormat } from 'near-api-js/lib/utils/format';

  export let bal: Balance;
  function getStrFormatted(): string {
    switch (bal.tok) {
      case TOKEN.Eth:
        return '0';
      case TOKEN.Near:
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
