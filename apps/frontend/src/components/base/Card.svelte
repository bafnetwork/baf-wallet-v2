<script lang="ts">
    export let style: string
</script>

<div {style}>
  <slot />
</div>

<style>
  div {
    background-color: var(--secondary-color);
    padding: 1.5rem;
    border-radius: 0.5rem;
    display: grid;
    justify-content: center;
    align-content: center;
  }
</style>
