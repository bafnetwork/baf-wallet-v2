<script lang="ts">
  import { getEnumValues } from '@baf-wallet/utils';
  import { Chain } from '@baf-wallet/interfaces';
  import Lazy from '@baf-wallet/base-components/Lazy.svelte';
  import { ChainStores, checkChainInit } from '../../state/chains.svelte';
  import { reinitApp } from '../../config/init.svelte';
  import { apiClient } from '../../config/api';
  import { SiteKeyStore } from '../../state/keys.svelte';
  import { AccountStore } from '../../state/accounts.svelte';

  const chains = getEnumValues(Chain);
  const ChainDeleteAccountComponent = (chain: Chain) => () =>
    import(`../../../../../libs/${chain}/src/web/DeleteAccount.svelte`);

  const ChainInitAccountComponent = (chain: Chain) => () =>
    import(`../../../../../libs/${chain}/src/web/InitAccount.svelte`);
</script>

{#each chains as chain}
  {#if checkChainInit($ChainStores, chain)}
    <!-- content here -->
    Delete your {chain} initialized account: <Lazy
      component={ChainDeleteAccountComponent(chain)}
      cb={reinitApp}
      chainInterface={$ChainStores[chain]}
      {apiClient}
      keyState={$SiteKeyStore}
      accountState={$AccountStore}
    />
  {:else}
    Initialize your {chain} account: <Lazy
      component={ChainInitAccountComponent(chain)}
      cb={reinitApp}
      {apiClient}
      keyState={$SiteKeyStore}
      accountState={$AccountStore}
    />
  {/if}
{/each}
