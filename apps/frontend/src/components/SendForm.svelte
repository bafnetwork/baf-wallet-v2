<script lang="ts">
  import Input from './base/Input.svelte';
  import InputNumeric from './base/InputNumeric.svelte';
  let sendAddr: string, amount: number;
</script>

<form action="">
  <Input
    label="Sending to"
    placeholder="JohnDoe.near"
    bind:value={sendAddr}
    required="true"
  />
  <InputNumeric
    label="Sending to"
    placeholder="0"
    bind:value={amount}
    required="true"
  />
</form>
