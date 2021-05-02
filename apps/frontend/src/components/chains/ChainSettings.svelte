<script lang="ts">
  // import InitNearAccount from './near/InitAccount.svelte';
  // import DeleteNearAccount from './near/DeleteAccount.svelte';
  import { getEnumValues } from '@baf-wallet/utils';
  import { Chain } from '@baf-wallet/interfaces';
  import Lazy from '@baf-wallet/base-components/Lazy.svelte';
  import { ChainStores, checkChainInit } from '../../state/chains.svelte';

  const chains = getEnumValues(Chain);
  const ChainDeleteAccountComponent = (chain: Chain) =>
    () => import(`./${chain}/DeleteAccount.svelte`);
  const ChainInitAccountComponent = (chain: Chain) =>
    () => import(`./${chain}/InitAccount.svelte`);
</script>

{#each chains as chain}
  {#if checkChainInit($ChainStores, chain)}
    <!-- content here -->
    Delete your {chain} initialized account: <Lazy
      component={ChainDeleteAccountComponent(chain)}
    />
  {:else}
    Initialize your {chain} account: <Lazy
      component={ChainInitAccountComponent(chain)}
    />
  {/if}
{/each}
