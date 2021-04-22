<script lang="ts">
  import { AccountStore  } from '../state/accounts.svelte';
  import { packKey, SiteKeyStore } from '../state/keys.svelte';
  import jazzicon from 'jazzicon';
  import Dropdown from '../components/base/Dropdown.svelte';
  import Card from '../components/base/Card.svelte';
  import Layout from '../components/Layout.svelte';
  import Listbalances from '../components/Listbalances.svelte';
  import History from '../components/History.svelte';
  import Button from '../components/base/Button.svelte';
  import { saveAs } from 'file-saver';
  import { KeyFormats } from '@baf-wallet/interfaces';
  import { ChainUtil, formatKey } from '@baf-wallet/multi-chain';
  import { apiClient } from '../config/api';

  let viewMode: 'assets' | 'history' = 'assets';

  let displayName: string;
  let accounts = $AccountStore;
  let pubkey = formatKey($SiteKeyStore.secpPK);

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
      console.log('bruh');
      return;
    }
    const icon = jazzicon(40, hashdisplayName(displayName));
    displayNameContainer.prepend(icon);
  })();

  function downloadKeys() {
    const key = packKey($SiteKeyStore);
    const fileToSave = new Blob([JSON.stringify(key)], {
      type: 'application/json',
    });
    saveAs(fileToSave, 'baf-wallet.json');
  }

  async function initNearAccount() {
    // TODO: implement nonce with the smart contract
    const nonce = Math.random().toString();
    const userId = "lev_s#7844"

    apiClient.createNearAccount({
      createNearAccountParams: {
        userID: userId,
        nonce,
        edPubkey: formatKey($SiteKeyStore.edPK, KeyFormats.hex),
        edSig: ChainUtil.signEd25519(
          $SiteKeyStore.edSK,
          ChainUtil.createUserVerifyMessage(userId, nonce)
        ).toHex(),
        secpSig: ChainUtil.signSecp256k1(
          $SiteKeyStore.secpSK,
          ChainUtil.createUserVerifyMessage(userId, nonce)
        ).toDER('hex'),
      },
    });
  }
</script>

<Layout>
  <Card classExtra="flex flex-col container mx-auto">
    <h1 class="pb-6 text-4xl text-center">Account</h1>
    <div
      bind:this={displayNameContainer}
      class="flex flex-row items-center justify-center pb-6"
    >
      <div class="ml-3">
        <Dropdown
          bind:selected={displayName}
          items={Object.keys(accounts.byDisplayName).map((name) => {
            return {
              label: `${name} / ${pubkey.slice(0, 4)}...${pubkey.slice(-4)}`,
              value: name,
              meta: accounts.byDisplayName[name],
            };
          })}
        />
      </div>
    </div>
    <div class="flex flex-row justify-around">
      <button
        on:click={() => (viewMode = 'assets')}
        class={`appearance-none transition duration-150 ease-in-out text-xl flex-grow text-center p-2 rounded-md ${
          viewMode === 'assets' ? 'z-10 bg-white' : 'hover:bg-blueGray-200'
        }`}>Assets</button
      >
      <button
        on:click={() => (viewMode = 'history')}
        class={`appearance-none transition duration-150 ease-in-out text-xl flex-grow text-center p-2 rounded-md ${
          viewMode === 'assets' ? 'hover:bg-blueGray-200' : 'z-10 bg-white'
        }`}>History</button
      >
    </div>
    {#if viewMode === 'assets'}
      <div
        class="container z-10 pb-4 mx-auto transition duration-150 ease-in-out bg-white rounded-md"
      >
        <Listbalances />
      </div>
    {:else}
      <div
        class="z-10 pb-4 transition duration-150 ease-in-out bg-white rounded-md"
      >
        <History />
      </div>
    {/if}
    <div class="container z-6 p-4 m-4">
      <Button onClick={initNearAccount}>Initialize Account with Near</Button>
    </div>
    <div class="container z-6 p-4 m-4 danger-zone">
      <h3 class="pb-4 text-2xl text-left">Danger Zone</h3>
      <div class="ml-6">
        <Button onClick={downloadKeys}>Download your keys</Button>
      </div>
    </div>
  </Card>
</Layout>

<style>
  .danger-zone {
    border: 1px var(--danger-color) solid;
    border-radius: 2rem;
  }
</style>
