<script lang="ts">
  import SendForm from './SendForm.svelte';
  import Card, {
    Content,
    Actions,
    ActionButtons,
    ActionIcons,
  } from '@smui/card';
  import Button, { Label } from '@smui/button';

  import { getContext } from 'svelte';
  import { Chain, SupportedTransferTypes } from '@baf-wallet/interfaces';
  import { TokenInfo } from '@baf-wallet/trust-wallet-assets';
  const { close } = getContext('modal');
  let submit: (e: Event) => Promise<void>;

  export let chain: Chain;
  export let transferType: SupportedTransferTypes;
  export let contractAddress: string;
  export let tokenInfo: TokenInfo;
</script>

<div class="wrapper">
  <Card padded>
    <form on:submit={submit}>
      <Content>
        <h1>Send {tokenInfo.name}</h1>
        <SendForm
          postSubmitHook={close}
          {transferType}
          {chain}
          {tokenInfo}
          {contractAddress}
          bind:handleSubmit={submit}
        />
      </Content>
      <Actions>
        <Button type="submit" variant="raised">
          <Label>Send!</Label>
        </Button>
        <Button on:click={close}>
          <Label>Cancel</Label>
        </Button>
      </Actions>
    </form>
  </Card>
</div>

<style>
  .wrapper {
    max-width: 300px;
  }
</style>
