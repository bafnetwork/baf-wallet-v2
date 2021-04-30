<script lang="ts">
    export let onClick: () => void;
    export let type = "button"
    export let style
</script>

<button {type} on:click={onClick} {style}>
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