<script lang="ts">
  import { Buffer } from 'buffer';
  (window as any).Buffer = Buffer;
  import Modal from '@baf-wallet/base-components/Modal.svelte';
  import Router from 'svelte-spa-router';
  import Login from './pages/Login.svelte';
  import Account from './pages/Account.svelte';
  import Settings from './pages/Settings.svelte';
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

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/svelte-material-ui@4.0.0/bare.min.css"
/>
<!-- Material Icons -->
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
/>
<!-- Roboto -->
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700"
/>
<!-- Roboto Mono -->
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Roboto+Mono"
/>

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
