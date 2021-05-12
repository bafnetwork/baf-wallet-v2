<script lang="ts">
  import { link } from 'svelte-spa-router';
  import Button from '@smui/button';
  import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
  import IconButton from '@smui/icon-button';
  import { AccountStore, logout } from '../state/accounts.svelte';

  export let isLoggedIn: boolean;

  let prominent = false;
  let dense = false;
  let secondaryColor = false;
</script>

{#if $AccountStore.loggedIn}
  <TopAppBar
    variant="static"
    {prominent}
    {dense}
    color={secondaryColor ? 'secondary' : 'primary'}
  >
    <Row>
      <Section align="end" toolbar>
        <a href="/" use:link>
          <IconButton class="material-icons" aria-label="Home">home</IconButton>
        </a>
        <a href="/settings" use:link>
          <IconButton class="material-icons" aria-label="Account Page">
            account_circle
          </IconButton>
        </a>
        {#if isLoggedIn}
          <Button color="secondary" on:click={logout} variant="raised">
            Logout
          </Button>
        {:else}
          <Button color="secondary" on:click={logout} variant="raised">
            Logout
          </Button>
        {/if}
      </Section>
    </Row>
  </TopAppBar>
{:else}
  <div />
{/if}

<style>
  a {
    color: inherit;
    text-decoration: none;
  }
</style>
