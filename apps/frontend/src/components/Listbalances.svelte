<script lang="ts">
  import type { Balance } from '../interfaces';
  import { TOKEN } from '../interfaces';
  import AmountFormatter from './base/AmountFormatter.svelte';
  import trustWalletAssets from '../trust-wallet-assets';

  const { getChainLogoUrl, getChainInfo } = trustWalletAssets;
  
  export const balances: Balance[] = [{ tok: TOKEN.Near, balance: '100000000000000000000000000' }];

  const chainInfosProm = Promise.all(balances.map(({ tok }: Balance) => getChainInfo(tok)));
</script>

<div class="container px-2 mx-auto sm">
  <table class="w-full table-fixed">
    <thead>
      <tr>
        <th class="w-8"></th>
        <th class="w-auto">Asset</th>
        <th class="w-auto">Balance</th>
      </tr>
    </thead>
    <tbody>
      {#await chainInfosProm then chainInfos}
        {#each balances as bal, i}
        <tr>
          <td class="mr-2">
            <img class="object-scale-down mx-2" src={getChainLogoUrl(bal.tok)} alt={`${bal.tok}.png`}/>
          </td>
          <td class={i % 2 == 0 ? "bg-gray-100 text-center": "text-center"}>
            {`$${chainInfos[i].symbol}`}
          </td>
          <td class={i % 2 == 0 ? "bg-gray-100 text-center": "text-center"}>
            <AmountFormatter {bal} />
          </td>
        </tr>
        {/each}
      {:catch error}
        <span>An error occurred when attempting to fetch asset data: {error}</span>
      {/await}
    </tbody>
  </table>
</div>