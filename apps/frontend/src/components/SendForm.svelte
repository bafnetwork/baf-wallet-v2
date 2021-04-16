<script lang="ts">
  import Button from './base/Button.svelte';
  import Input from './base/Input.svelte';
  import InputNumeric from './base/InputNumeric.svelte';
  import TxModal from './TxModal.svelte';

  let sendAddr: string, amount: number;
  export let postSubmitHook: () => void | undefined;
  export let onCancel: () => void | undefined;

  import { getContext } from "svelte";
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
    open(TxModal, { txLink: "https://explorer.near.org/", isComplete, error });
  }

</script>

<form on:submit={handleSubmit}>
  <Input
    label="Sending to"
    placeholder="JohnDoe.near"
    bind:value={sendAddr}
    required={true}
  />
  <InputNumeric
    label="Sending to"
    placeholder="0 Near"
    bind:value={amount}
    required={true}
  />
  <div class="flex flex-row justify-around pt-3">
    {#if onCancel !== undefined}
      <Button onClick={onCancel}>Cancel</Button>
    {/if}
    <Button type="submit">Submit</Button>
  </div>
</form>
