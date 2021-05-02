<script lang="ts">
  import Card from '@baf-wallet/base-components/Card.svelte';
  import SendForm from './SendForm.svelte';
  import XButton from '@baf-wallet/base-components/XButton.svelte';

  import { getContext } from 'svelte';
  import { Chain } from '@baf-wallet/interfaces';
  const { close } = getContext('modal');

  export let chain: Chain;
</script>

<div class="wrapper">
  <Card styleType="secondary">
    <XButton onClick={close} />
    <h1>Send {chain}</h1>
    <SendForm postSubmitHook={close} {chain} onCancel={close} />
  </Card>
</div>
<style>
  .wrapper {
    max-width: 300px;
  }
</style>
