<script lang="ts">
  import Navbar from './Navbar.svelte';
  import Footer from './Footer.svelte';

  export let classes = "default";
  export let isLoggedIn: boolean;
</script>

<div class="container">
  <Navbar isLoggedIn={isLoggedIn}/>
  <div class={classes}>
    <slot />
  </div>
  <Footer />
</div>

<style>
  .container {
    display: grid;
    gap: 20px;
    grid-template-rows: min-content 1fr min-content;
    grid-template-areas:
      'nav'
      'content'
      'footer';
    min-height: 100%;
  }

  .default {
    display: grid;
    justify-content: center;
    align-content: baseline;
  }
</style>
