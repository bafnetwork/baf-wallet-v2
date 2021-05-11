<script lang="ts">
  import { onMount, SvelteComponent } from 'svelte';

  export let component;
  export let delayMs = 500;
  export let selfBind

  let loadedComponent = null;
  let timeout;
  let showFallback = !delayMs;

  let props;
  $: {
    const { component, delayMs, ...restProps } = $$props;
    props = restProps;
  }

  onMount(async () => {
    if (delayMs) {
      timeout = setTimeout(() => {
        if (!loadedComponent) showFallback = true;
      }, delayMs);
    }
    component().then((module) => {
      loadedComponent = module.default;
    });
    return () => clearTimeout(timeout);
  });
</script>

{#if loadedComponent !== null}
  <svelte:component this={loadedComponent} {...props} bind:this={selfBind} />
{:else if showFallback}
  fallback
  <slot />
{/if}
