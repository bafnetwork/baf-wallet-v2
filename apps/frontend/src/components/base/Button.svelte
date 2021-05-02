<script lang="ts">
  import { StyleType } from '../../interfaces';

  export let onClick: () => void;
  export let type = 'button';
  export let style;
  export let styleType: StyleType = 'primary';
</script>

<button {type} on:click={onClick} {style} class={styleType}>
  <slot />
</button>

<style>
  button {
    border-radius: 0.5rem;
    border: 0px;
    padding: 0.5rem;
    cursor: pointer;
    width: fit-content;
  }
</style>
