<script lang="ts">
  import Card from './base/Card.svelte';
  import SendForm from './SendForm.svelte';
  import XButton from './base/XButton.svelte';

  import { getContext } from 'svelte';
  import { Chain } from '@baf-wallet/interfaces';
  const { close } = getContext('modal');

  export let chain: Chain;
</script>

<Card>
  <XButton onClick={close} />
  <h1>Send {chain}</h1>
  <SendForm postSubmitHook={close} {chain} onCancel={close} />
</Card>
