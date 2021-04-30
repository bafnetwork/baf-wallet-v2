<script lang="ts">
  import { link } from 'svelte-spa-router';
  import Button from './base/Button.svelte';
  import { AccountStore, logout } from '../state/accounts.svelte';
</script>

<div class="container">
  {#if $AccountStore.loggedIn}
    <a
      class="col-span-1 col-start-10 text-lg text-center text-white"
      href="/"
      use:link>Account</a
    >
    <a
      class="col-span-1 col-start-11 text-lg text-center text-white"
      href="/apps"
      use:link>Apps</a
    >
    <!-- TODO: different color -->
    <Button
      onClick={logout}
      classExtra="col-start-12 col-span-1 logout"
      color="white">Logout</Button
    >
  {:else}
    <a href="/login" use:link>Login</a>
  {/if}
</div>

<style >
  .logout {
    background-color: var(--danger-color);
  }

  .container {
    background-color: var(--primary-color);
    padding: 1rem;
  }

  a {
    color: var(--secondary-color);
  }

</style>
