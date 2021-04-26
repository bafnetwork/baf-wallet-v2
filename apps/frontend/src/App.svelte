<script lang="ts">
  import './typings';
  import { Buffer } from 'buffer';
  (window as any).Buffer = Buffer;
  import Modal from './components/base/Modal.svelte';
  import Router from 'svelte-spa-router';
  import Login from './pages/Login.svelte';
  import Account from './pages/Account.svelte';
  import ApproveRedirect from './pages/ApproveRedirect.svelte';
  import NotFound404 from './pages/NotFound404.svelte';
  import { AccountStore, initAccount } from './state/accounts.svelte';
  import { setBafContract } from '@baf-wallet/baf-contract';
  import { NearAccount } from '@baf-wallet/multi-chain';

  const routesLoggedIn = {
    '/': Account,
    '/approve-redirect/:opts': ApproveRedirect,
    '/login': Login,
    '/*': NotFound404,
  };
  const routesLoggedOut = {
    '/': Login,
    '/:attemptedRoute': Login,
  };

  async function init(): Promise<void> {
    await initAccount();
    if ($AccountStore.chainAccounts[0].init)
      await setBafContract((await NearAccount.get()).masterAccount);
  }
  const initProm = init();
</script>

{#await initProm}
  <p>Loading...</p>
{:then ret}
  <Modal>
    {#if $AccountStore.loggedIn}
      <Router routes={routesLoggedIn} />
    {:else}
      <Router routes={routesLoggedOut} />
    {/if}
  </Modal>
{:catch error}
  <p>An error occured loading the page: {console.error(error)}</p>
{/await}

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
