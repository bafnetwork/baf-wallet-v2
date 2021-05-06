<script lang="ts">
  import Card from '@baf-wallet/base-components/Card.svelte';
  import SendForm from './SendForm.svelte';
  import XButton from '@baf-wallet/base-components/XButton.svelte';

  import { getContext } from 'svelte';
  import { Chain, SupportedTransferTypes } from '@baf-wallet/interfaces';
import { TokenInfo } from '@baf-wallet/trust-wallet-assets';
  const { close } = getContext('modal');

  export let chain: Chain;
  export let transferType: SupportedTransferTypes;
  export let contractAddress: string;
  export let tokenInfo: TokenInfo;

</script>

<div class="wrapper">
  <Card styleType="secondary">
    <XButton onClick={close} />
    <h1>Send {tokenInfo.name}</h1>
    <SendForm
      postSubmitHook={close}
      {transferType}
      {chain}
      {tokenInfo}
      {contractAddress}
      onCancel={close}
    />
  </Card>
</div>

<style>
  .wrapper {
    max-width: 300px;
  }
</style>
