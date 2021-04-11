<script lang="ts">
  import { KeyStore } from '../state/keys.svelte';

  import { link } from 'svelte-spa-router';
  import Button from './base/Button.svelte';
  import { formatKey } from '@baf-wallet/multi-chain';
  const openSendTxModal = () => {};
</script>

<div
  class="sticky top-0 z-30 flex flex-row justify-between p-4 bg-blue-500 shadow-md h-min"
>
  <a class="text-lg text-white justify-self-start" href="/" use:link>Account</a>
  <a class="text-lg text-white" href="/history" use:link>History</a>
  <a class="text-lg text-white" href="/apps" use:link>Apps</a>
  <Button onClick={openSendTxModal} color="white">Send</Button>
  {formatKey($KeyStore.secp256k1Pubkey)}
</div>
