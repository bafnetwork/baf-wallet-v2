<script lang="ts">
  import Layout from '../components/Layout.svelte';
  import Auth from '../components/Auth.svelte';
</script>

<Layout>
  <div class="wrapper">
    <h2>Welcome to BAF Wallet</h2>
    <Auth />
  </div>
</Layout>

<style>
  div.wrapper {
    display: grid;
    justify-content: center;
    grid-template-rows: min-content min-content;
  }
</style>
