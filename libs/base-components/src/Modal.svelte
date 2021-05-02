<script lang="ts">
  import { setContext, createEventDispatcher } from 'svelte';
  
  export function bind(Component, props = {}) {
    return function ModalComponent(options) {
      return new Component({
        ...options,
        props: {
          ...props,
          ...options.props,
        },
      });
    };
  }

  interface ModalCallbacks {
    onOpen?: (e: any) => void;
    onClose?: (e: any) => void;
  }

  const dispatch = createEventDispatcher();

  let Component: any = null;

  const defaultCallbacks = { onOpen: (_) => {}, onClose: (_) => {} };
  let callbacks: ModalCallbacks = defaultCallbacks;

  const open = (
    NewComponent: any,
    props: any = {},
    cbs: ModalCallbacks = {}
  ) => {
    Component = bind(NewComponent, props);
    callbacks.onOpen = (e: any) => {
      if (cbs.onOpen) {
        cbs.onOpen(e);
      }
      dispatch('open');
    };
    callbacks.onClose = (e: any) => {
      if (cbs.onClose) {
        cbs.onClose(e);
      }
      dispatch('close');
    };
  };

  function close(cb?: () => void) {
    Component = null;
    callbacks = {};
    if (cb) {
      cb();
    }
  }

  let overlay: HTMLElement;
  let container: HTMLElement;

  function handleClick(e: any) {
    if (e.target === overlay || e.target === container) {
      if (callbacks.onClose) {
        callbacks.onClose(e);
      }
      close();
    }
  }

  $: visibilityClasses = Component ? '' : 'hidden';

  setContext('modal', { open, close });
</script>

<div
  bind:this={overlay}
  on:click={handleClick}
  class={`wrapper ${visibilityClasses}`}
>
  <div
    bind:this={container}
    class={`body-wrapper ${visibilityClasses}`}
  >
    <svelte:component this={Component} />
  </div>
</div>
<slot />

<style>
  .hidden {
    display: none!important;
  }

  .wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    align-content: center;
    justify-content: center;
    background-color: rgb(0, 0, 0, 0.2);
  }

  .body-wrapper {
  }

</style>