<script lang="ts">
  import { link } from 'svelte-spa-router';
  import Button from './base/Button.svelte';
  import { AccountStore, logout } from '../state/accounts.svelte';
</script>

<div class="container">
  {#if true}
    <!-- $AccountStore.loggedIn} -->
    <a href="/" use:link>Account</a>
    <a href="/" use:link>Chains</a>
    <Button
      onClick={logout}
      style="color: white; background-color: var(--danger-color)">Logout</Button
    >
  {:else}
    <a href="/login" use:link>Login</a>
  {/if}
</div>

<style>
  .container {
    background-color: var(--primary-color);
    padding: 1rem;
    display: grid;
    justify-content: end;
    align-items: center;
    grid-template-columns: repeat(3, min-content);
    gap: 1rem;
  }

  a {
    color: var(--secondary-color);
  }
</style>
