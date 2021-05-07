<script lang="ts">
  import Button, { Label } from '@smui/button';
  import { StyleType } from '@baf-wallet/interfaces';

  export let onClick: () => void;
  export let type = 'button';
  export let style;
  export let styleType: StyleType = 'primary';
</script>

<Button {type} on:click={onClick} {style} class={styleType} variant="raised">
  <slot />
</Button>

<style>
</style>
