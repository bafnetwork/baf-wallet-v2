<script lang="ts">
  import { Buffer } from 'buffer';
  (window as any).Buffer = Buffer;
  import Modal from './components/base/Modal.svelte';
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
      //  ed25519Pubkey:
      secp256k1Pubkey: Buffer.from(
        'BfaBf538323A1D21453b5F6a374A07867D867196',
        'hex'
      ),
      ed25519Pubkey: Buffer.from(
        'emnAJc96ms/Da6K/Wu2AVm8NXPhdbUBohwMOYKTQ1Eo=',
        'base64'
      ),
      secret: Buffer.from(
        '7zlbvQqMGvGpe0cBTpXGJH9HZmxPT3acA+/l/7xN69d6acAlz3qaz8Nror9a7YBWbw1c+F1tQGiHAw5gpNDUSg==',
        'base64'
      ),
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
