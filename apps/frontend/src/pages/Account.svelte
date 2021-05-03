<script lang="ts">
  import { link } from 'svelte-spa-router';
  import { packKey, SiteKeyStore } from '../state/keys.svelte';
  import jazzicon from 'jazzicon';
  import Dropdown from '@baf-wallet/base-components/Dropdown.svelte';
  import Card from '@baf-wallet/base-components/Card.svelte';
  import Layout from '../components/Layout.svelte';
  import Listbalances from '../components/Listbalances.svelte';
  import History from '../components/History.svelte';
  import Button from '@baf-wallet/base-components/Button.svelte';
  import { ChainStores, checkChainInit } from '../state/chains.svelte';
  import { Chain, Encoding } from '@baf-wallet/interfaces';
  import { getEnumValues } from '@baf-wallet/utils';

  let viewMode: 'assets' | 'history' = 'assets';

  let displayName: string;
  let noChainInit = getEnumValues(Chain).every(
    (chain) => !checkChainInit($ChainStores, chain)
  );

  function hashdisplayName(displayName: string) {
    var hash = 0;
    if (displayName.length == 0) {
      return hash;
    }
    for (var i = 0; i < displayName.length; i++) {
      var char = displayName.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  let displayNameContainer;
  $: _ = (() => {
    if (!displayName) {
      return;
    }
    const icon = jazzicon(40, hashdisplayName(displayName));
    displayNameContainer.prepend(icon);
  })();
</script>

<Layout>
  {#if noChainInit}
    <h1>Hi there!</h1>
    <p>
      It looks like you have not setup your account on any of the Blockchains
      which we support.
    </p>
    <p>
      Please see initialize your <a href="/settings" use:link>account's page</a>
    </p>
  {:else}
    <h1>Account</h1>
    {#if viewMode === 'assets'}
      <Listbalances />
    {:else}
      <History />
    {/if}
  {/if}
</Layout>
