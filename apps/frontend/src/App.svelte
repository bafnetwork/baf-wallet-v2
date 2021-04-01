<script lang="ts">
  import Modal from "./components/base/Modal.svelte";
  import Router from 'svelte-spa-router';
  import Login from './pages/Login.svelte';
  import Account from './pages/Account.svelte';
  import ApproveRedirect from './pages/ApproveRedirect.svelte';
  import NotFound404 from './pages/NotFound404.svelte';
  import { KeyStore } from './state/keys.svelte';

  const routesLoggedIn = {
    '/': Account,
    '/approve-redirect/:opts': ApproveRedirect,
    '/login': Login,
    '/*': NotFound404,
  };
  const routesLoggedOut = {
    '/login': Login,
    '/:attemptedRoute': Login,
  };

  // TODO: implement with tor.us
  async function init(): Promise<boolean> {
    KeyStore.set({
      pubkey: 'Fake news',
      privkey: 'Is real?',
    });
    return true;
  }
  const initProm = init();
</script>

{#await initProm}
  <p>Loading...</p>
{:then loggedIn}
  <Modal>
    <Router routes={loggedIn ? routesLoggedIn : routesLoggedOut} />
  </Modal>
{:catch error}
  <p>An error occured loading the page: {error.toString()}</p>
{/await}

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
