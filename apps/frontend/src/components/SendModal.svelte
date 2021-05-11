<script lang="ts">
  import SendForm from './SendForm.svelte';
  import Card, { Content, Actions } from '@smui/card';

  import { getContext } from 'svelte';
  import { Chain, TokenInfo, SupportedTransferTypes } from '@baf-wallet/interfaces';
  const { close } = getContext('modal');

  export let chain: Chain;
  export let transferType: SupportedTransferTypes;
  export let contractAddress: string;
  export let tokenInfo: TokenInfo;
</script>

<div class="wrapper">
  <Card padded>
    <SendForm
      postSubmitHook={close}
      {transferType}
      {chain}
      {tokenInfo}
      {contractAddress}
    />
  </Card>
</div>

<style>
  .wrapper {
    max-width: 300px;
  }
</style>
