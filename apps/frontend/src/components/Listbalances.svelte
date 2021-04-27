<script lang="ts">
  import { ChainBalance, ChainName } from '@baf-wallet/interfaces';
  import { ChainInfo } from '@baf-wallet/trust-wallet-assets';
  import AmountFormatter from './base/AmountFormatter.svelte';
  import trustWalletAssets from '../trust-wallet-assets';
  import { AccountStore } from '../state/accounts.svelte';
  import { getAccountBalance } from '@baf-wallet/multi-chain';

  const { getChainLogoUrl, getChainInfo } = trustWalletAssets;

  async function initBalances(): Promise<
    { chainInfo: ChainInfo; bal: ChainBalance }[]
  > {
    const balanceProms: Promise<ChainBalance>[] = Object.keys($AccountStore.chainInfos).map(
      async (chain: ChainName) => {
        const chainInfo = $AccountStore.chainInfos[chain]
        return {
          chain,
          balance: await getAccountBalance(chain, chainInfo.account),
        } as ChainBalance;
      }
    );
    const balances: ChainBalance[] = await Promise.all(balanceProms);
    return Promise.all(
      balances.map((bal: ChainBalance) => {
        return getChainInfo(bal.chain).then((chainInfo) => {
          return {
            bal,
            chainInfo,
          };
        });
      })
    );
  }
</script>

<div class="container px-2 mx-auto sm">
  <table class="w-full table-fixed">
    <thead>
      <tr>
        <th class="w-8" />
        <th class="w-auto">Asset</th>
        <th class="w-auto">Balance</th>
      </tr>
    </thead>
    <tbody>
      {#await initBalances() then chains}
        {#each chains as chain, i}
          <tr>
            <td class="mr-2">
              <img
                class="object-scale-down mx-2"
                src={getChainLogoUrl(chain.bal.chain)}
                alt={`${chain.bal.chain}.png`}
              />
            </td>
            <td class={i % 2 == 0 ? 'bg-gray-100 text-center' : 'text-center'}>
              {`$${chain.chainInfo.symbol}`}
            </td>
            <td class={i % 2 == 0 ? 'bg-gray-100 text-center' : 'text-center'}>
              <AmountFormatter bal={chain.bal} />
            </td>
          </tr>
        {/each}
      {:catch error}
        <span
          >An error occurred when attempting to fetch asset data: {error}</span
        >
      {/await}
    </tbody>
  </table>
</div>
