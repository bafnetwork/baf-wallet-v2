<script lang="ts">
  import Card from './base/Card.svelte';
  import SendForm from './SendForm.svelte';
  import XButton from './base/XButton.svelte';

  import { getContext } from 'svelte';
  import { Chain } from '@baf-wallet/interfaces';
  const { close } = getContext('modal');

  export let chain: Chain;
</script>

<Card classExtra="w-1/4 flex flex-col relative">
  <XButton onClick={close} />
  <h1 class="pb-5 text-3xl">Send</h1>
  <SendForm postSubmitHook={close} onCancel={close} />
</Card>
