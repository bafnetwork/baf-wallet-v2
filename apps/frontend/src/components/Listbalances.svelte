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
    open(SendModal, { chain });
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

<div class="wrapper">
  <th />
  <th>Asset</th>
  <th>Balance</th>
  <th>Actions</th>
  {#await initBalances() then chains}
    {#each chains as chain, i}
      <img
        src={getChainLogoUrl(chain.bal.chain)}
        alt={`${chain.bal.chain}.png`}
      />
      <div>
        {`${chain.chainInfo.symbol}`}
      </div>
      <div>
        <AmountFormatter bal={chain.bal} />
      </div>
      <Button onClick={() => openSendModal(chain.bal.chain)} color="blue"
        >Transfer</Button
      >
    {/each}
  {:catch error}
    <span>An error occurred when attempting to fetch asset data: {error}</span>
  {/await}
</div>

<style>
  /* your styles go here */
  .wrapper {
    display: grid;
    gap: 1rem;
    grid-template-columns: 2rem 1fr 1fr 1fr;
    justify-items: center;
    align-items: center;
  }
  img {
    width: 100%;
  }
</style>
