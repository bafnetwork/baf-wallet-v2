<script lang="ts">
  import Modal from './components/base/Modal.svelte';
  import Router from 'svelte-spa-router';
  import Login from './pages/Login.svelte';
  import Account from './pages/Account.svelte';
  import ApproveRedirect from './pages/ApproveRedirect.svelte';
  import NotFound404 from './pages/NotFound404.svelte';
  import { KeyStore } from './state/keys.svelte';
  import * as b58 from 'b58';
  import { Buffer } from 'buffer';

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
      // dummmy randomly generated keys
      // 'ed25519:XdddS019FjorusyB3b8Gsp+/Sxb28Ec3D3ytRdNGW+8=',
      pubkey: b58.encode(
        Buffer.from([
          93,
          215,
          93,
          75,
          77,
          125,
          22,
          58,
          43,
          186,
          204,
          129,
          221,
          191,
          6,
          178,
          159,
          191,
          75,
          22,
          246,
          240,
          71,
          55,
          15,
          124,
          173,
          69,
          211,
          70,
          91,
          239,
        ])
      ),
      privkey: b58.encode(
        Buffer.from([
          175,
          227,
          150,
          112,
          153,
          154,
          233,
          144,
          167,
          168,
          255,
          183,
          191,
          235,
          92,
          142,
          172,
          28,
          88,
          90,
          165,
          172,
          207,
          210,
          134,
          247,
          229,
          49,
          154,
          255,
          242,
          147,
          93,
          215,
          93,
          75,
          77,
          125,
          22,
          58,
          43,
          186,
          204,
          129,
          221,
          191,
          6,
          178,
          159,
          191,
          75,
          22,
          246,
          240,
          71,
          55,
          15,
          124,
          173,
          69,
          211,
          70,
          91,
          239,
        ])
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
