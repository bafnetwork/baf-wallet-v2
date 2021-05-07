<script lang="ts">
  import Card from '@smui/card';
  import { StyleType } from '@baf-wallet/interfaces';

  export let style: string;
  export let styleType: StyleType = 'primary';
</script>

<Card {style} class={`${styleType}`} padded>
  <slot />
</Card>

<style>
</style>
