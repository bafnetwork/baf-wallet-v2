<script lang="ts">
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

  import { setContext, createEventDispatcher } from 'svelte';

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

  $: visibilityClasses = Component ? '' : 'hidden invisible opacity-0';

  setContext('modal', { open, close });
</script>

<div
  bind:this={overlay}
  on:click={handleClick}
  class={`z-40 absolute top-0 left-0 w-screen h-screen bg-gray-900 bg-opacity-50 ${visibilityClasses}`}
>
  <div
    bind:this={container}
    class={`z-40 container flex flex-col items-center justify-center h-full m-auto ${visibilityClasses}`}
  >
    <svelte:component this={Component} />
  </div>
</div>
<slot />
