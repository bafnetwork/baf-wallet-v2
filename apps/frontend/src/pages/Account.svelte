<script lang="ts">
  // import { crossfade } from "svelte/types/runtime/transition";
  import jazzicon from "jazzicon";
  import { onMount } from "svelte";
  import Card from '../components/base/Card.svelte';
  import Layout from '../components/Layout.svelte';
  import Listbalances from '../components/Listbalances.svelte';

  let viewMode: "assets" | "history" = "assets";
  export let accountId: string = "lev.near";

  function hashAccountId(accountId: string) {
    var hash = 0;
    if (accountId.length == 0) {
        return hash;
    }
    for (var i = 0; i < accountId.length; i++) {
        var char = accountId.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  let accountIdContainer;
  onMount(() => {
    const icon = jazzicon(20, hashAccountId(accountId));
    accountIdContainer.prepend(icon);
  });

</script>

<Layout>
  <Card classExtra="flex flex-col">
    <h1 class="pb-6 text-4xl text-center">Account</h1>
    <div bind:this={accountIdContainer} class="flex flex-row items-center justify-center pb-6">
      <h3 class="pl-3 text-xl">{accountId}</h3>
    </div>
    <div class="flex flex-row justify-around">
      <h2 on:click={() => viewMode = "assets"} class={`transition duration-150 ease-in-out text-xl flex-grow text-center p-2 rounded-md ${viewMode === "assets" ? "z-10 bg-white" : "hover:bg-gray-100"}`}>Assets</h2>
      <h2 on:click={() => viewMode = "history"} class={`transition duration-150 ease-in-out text-xl flex-grow text-center p-2 rounded-md ${viewMode === "assets" ? "hover:bg-gray-100" : "z-10 bg-white"}`}>History</h2>
    </div>
    {#if viewMode === "assets"}
      <div class="z-10 pb-4 transition duration-150 ease-in-out bg-white rounded-md">
        <Listbalances />
      </div>
    {:else}
      <div class="z-10 pb-4 transition duration-150 ease-in-out bg-white rounded-md">
        <div>TODO: History component</div>
      </div>
    {/if}
  </Card>
</Layout>
