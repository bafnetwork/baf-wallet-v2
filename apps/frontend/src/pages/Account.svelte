<script lang="ts">
  // import { crossfade } from "svelte/types/runtime/transition";
  import jazzicon from "jazzicon";
  import Dropdown from "../components/base/Dropdown.svelte";
  import type { AccountState } from "../state/accounts.svelte";
  import { AccountStore } from "../state/accounts.svelte";
  import Card from '../components/base/Card.svelte';
  import Layout from '../components/Layout.svelte';
  import Listbalances from '../components/Listbalances.svelte';

  let viewMode: "assets" | "history" = "assets";

  let displayName: string;
  let accounts: AccountState;
  const unsubAccountStore = AccountStore.subscribe(_accounts => {
    accounts = _accounts;
  })

  function hashdisplayName(displayName: string) {
    var hash = 0;
    if (displayName.length == 0) {
        return hash;
    }
    for (var i = 0; i < displayName.length; i++) {
        var char = displayName.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  let displayNameContainer;
  $: _ = (() => {
    if (!displayName) {
      console.log("bruh")
      return;
    }
    const icon = jazzicon(40, hashdisplayName(displayName));
    displayNameContainer.prepend(icon);
  })()

</script>

<Layout>
  <Card classExtra="flex flex-col container mx-auto">
    <h1 class="pb-6 text-4xl text-center">Account</h1>
    <div bind:this={displayNameContainer} class="flex flex-row items-center justify-center pb-6">
      <div class="ml-3">
        <Dropdown bind:selected={displayName} items={Object.keys(accounts.byDisplayName).map(name => ({
          label: name,
          value: name,
          meta: accounts.byDisplayName[name]
        }))}/>
      </div>
    </div>
    <div class="flex flex-row justify-around">
      <h2 on:click={() => viewMode = "assets"} class={`transition duration-150 ease-in-out text-xl flex-grow text-center p-2 rounded-md ${viewMode === "assets" ? "z-10 bg-white" : "hover:bg-blueGray-200"}`}>Assets</h2>
      <h2 on:click={() => viewMode = "history"} class={`transition duration-150 ease-in-out text-xl flex-grow text-center p-2 rounded-md ${viewMode === "assets" ? "hover:bg-blueGray-200" : "z-10 bg-white"}`}>History</h2>
    </div>
    {#if viewMode === "assets"}
      <div class="container z-10 pb-4 mx-auto transition duration-150 ease-in-out bg-white rounded-md">
        <Listbalances />
      </div>
    {:else}
      <div class="z-10 pb-4 transition duration-150 ease-in-out bg-white rounded-md">
        <div>TODO: History component</div>
      </div>
    {/if}
  </Card>
</Layout>
