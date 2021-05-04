<script lang="ts">
  import { Balance, Chain, ChainBalance } from '@baf-wallet/interfaces';
  import {
    getTokenLogoUrl,
    TokenInfo,
    getTokenInfo,
  } from '@baf-wallet/trust-wallet-assets';
  import AmountFormatter from '@baf-wallet/base-components/AmountFormatter.svelte';
  import { ChainStores } from '../state/chains.svelte';
  import Button from '@baf-wallet/base-components/Button.svelte';
  import { getContext } from 'svelte';
  import SendModal from './SendModal.svelte';
  const { open } = getContext('modal');

  function openSendModal(chain: Chain) {
    open(SendModal, { chain });
  }

  // TODO: merge with chainInfo
  // async function initContractBalances(): Promise<{name: string, bal: Balance}

  async function initChainBalances(): Promise<
    { chainInfo: TokenInfo; bal: Balance }[]
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
        return getTokenInfo(bal.chain).then((chainInfo) => {
          return {
            bal: bal.balance,
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
  {#await initChainBalances() then chains}
    {#each chains as chain, i}
      <img
        src={getTokenLogoUrl(chain.chainInfo.chain, chain.chainInfo.name)}
        alt={`${chain.chainInfo.name}.png`}
      />
      <div>
        {`${chain.chainInfo.symbol}`}
      </div>
      <div>
        <AmountFormatter chain={chain.chainInfo.chain} bal={chain.bal} />
      </div>
      <Button onClick={() => openSendModal(chain.chainInfo.chain)}
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
