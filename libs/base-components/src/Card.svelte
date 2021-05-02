<script lang="ts">
  import { StyleType } from '@baf-wallet/interfaces';

    export let style: string
    export let styleType: StyleType = 'primary'
</script>

<div {style} class={styleType}>
  <slot />
</div>

<style>
  div {
    padding: 1.5rem;
    border-radius: 0.5rem;
    display: grid;
    justify-content: center;
    align-content: center;
  }
</style>
