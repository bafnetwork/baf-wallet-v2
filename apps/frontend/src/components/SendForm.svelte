<script lang="ts">
  import { getContext } from 'svelte';
  import { Chain, CreateTxReturn } from '@baf-wallet/interfaces';
  import Button from '@baf-wallet/base-components/Button.svelte';
  import TxModal from './TxModal.svelte';
  import SendNearFormPart from './chains/near/SendFormPart.svelte';

  let createTX: <T>() => Promise<CreateTxReturn<T>>; 
  export let postSubmitHook: () => void | undefined;
  export let onCancel: () => void | undefined;
  export let chain: Chain;

  const { open } = getContext('modal');

  const handleSubmit = async (v: any) => {
    console.log(`submit: ${v}`);
    if (postSubmitHook !== undefined) {
      postSubmitHook();
    }

    let isComplete = false;
    let error;

    const { txParams, recipientUser } = await createTX()
    open(TxModal, {
      txLink: 'https://explorer.near.org/',
      chain,
      recipientUser,
      txParams,
      isComplete,
      error,
    });
  };
</script>

<form on:submit={handleSubmit}>
  {#if chain === Chain.NEAR}
    <SendNearFormPart bind:createTX />
    <div class="flex flex-row justify-around pt-3">
      {#if onCancel !== undefined}
        <Button onClick={onCancel}>Cancel</Button>
      {/if}
      <Button type="submit">Submit</Button>
    </div>
  {:else}
    Please enter a valid chain through which to send funds
  {/if}
</form>
