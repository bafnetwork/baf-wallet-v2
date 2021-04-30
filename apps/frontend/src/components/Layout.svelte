<script lang="ts">
  import Navbar from './Navbar.svelte';
  import Footer from './Footer.svelte';
</script>

<div class="container">
  <Navbar />
  <slot />
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
</style>
