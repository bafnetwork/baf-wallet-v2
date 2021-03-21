<script lang="ts">
  import Button from './base/Button.svelte';
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
    placeholder="0 NEAR"
    bind:value={amount}
    required="true"
  />
  <div class="flex p-3 justify-center">
    <Button type="submit">Submit</Button>
  </div>
</form>
