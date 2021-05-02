<script lang="ts">
  import { Buffer } from 'buffer';
  (window as any).Buffer = Buffer;
  import Modal from '@baf-wallet/base-components/Modal.svelte';
  import Router from 'svelte-spa-router';
  import Login from './pages/Login.svelte';
  import Account from './pages/Account.svelte';
  import Settings from './pages/Settings.svelte'
  import ApproveRedirect from './components/ApproveRedirect.svelte';
  import NotFound404 from './pages/NotFound404.svelte';
  import { AccountStore } from './state/accounts.svelte';
  import { initApp } from './config/init.svelte';

  const routesLoggedIn = {
    '/': Account,
    '/approve-redirect/:chain/:txParams': ApproveRedirect,
    '/settings': Settings,
    '/login': Login,
    '/*': NotFound404,
  };
  const routesLoggedOut = {
    '/': Login,
    '/:attemptedRoute': Login,
  };

  const initProm = initApp();
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
  <p>An error occured loading the page: {error.toString()}</p>
{/await}

<style global lang="postcss">
</style>
