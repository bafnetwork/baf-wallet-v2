<script lang="ts">
  import { getContext } from 'svelte';
  import { Chain } from '@baf-wallet/interfaces';
  import Button from './base/Button.svelte';
  import Input from './base/Input.svelte';
  import InputNumeric from './base/InputNumeric.svelte';
  import TxModal from './TxModal.svelte';
  import SendNearFormPart from './near/SendNearFormPart.svelte';

  let createTX: () => Promise<any>; //ChainTransaction
  export let postSubmitHook: () => void | undefined;
  export let onCancel: () => void | undefined;
  export let chain: Chain;

  const { open } = getContext('modal');

  const handleSubmit = (v: any) => {
    console.log(`submit: ${v}`);
    if (postSubmitHook !== undefined) {
      postSubmitHook();
    }

    let isComplete = false;
    let error;

    // TODO: execute transaction, set isComplete and error in promise (there's probably a better way to do that)
    // TODO: get explorer link
    open(TxModal, { txLink: 'https://explorer.near.org/', isComplete, error });
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
