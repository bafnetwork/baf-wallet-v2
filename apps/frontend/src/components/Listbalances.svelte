<script lang="ts">
  import { Chain, ChainBalance } from '@baf-wallet/interfaces';
  import { ChainInfo } from '@baf-wallet/trust-wallet-assets';
  import AmountFormatter from '@baf-wallet/base-components/AmountFormatter.svelte';
  import trustWalletAssets from '../trust-wallet-assets';
  import { ChainStores } from '../state/chains.svelte';
  import Button from '@baf-wallet/base-components/Button.svelte';
  import { getContext } from 'svelte';
  import SendModal from './SendModal.svelte';
  const { open } = getContext('modal');

  function openSendModal(chain: Chain) {
    open(SendModal, {chain});
  }

  const { getChainLogoUrl, getChainInfo } = trustWalletAssets;

  async function initBalances(): Promise<
    { chainInfo: ChainInfo; bal: ChainBalance }[]
  > {
    const balanceProms: Promise<ChainBalance>[] = Object.keys($ChainStores).map(
      async (chain: Chain) => {
        const chainInfo = $ChainStores[chain];
        return {
          chain,
          balance: await chainInfo.accounts
            .getGenericMasterAccount()
            .getBalance(),
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

<div>
  <table>
    <thead>
      <tr>
        <th />
        <th>Asset</th>
        <th>Balance</th>
        <th>Actions</th>
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
            <td class='text-center'>
              <Button
                onClick={() => openSendModal(chain.bal.chain)}
                color="blue"
                classExtra="col-start-12 col-span-1">Transfer</Button
              >
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
