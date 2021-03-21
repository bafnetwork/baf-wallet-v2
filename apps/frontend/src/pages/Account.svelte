<script>
    // import { crossfade } from "svelte/types/runtime/transition";
    import Button from "../components/base/Button.svelte";
    import Card from "../components/base/Card.svelte"
    import Dropdown from "../components/base/Dropdown.svelte";
    import Layout from "../components/Layout.svelte";
    import Listbalances from "../components/Listbalances.svelte";
</script>

<Layout>
  <Card>
    <h1 class="text-4xl">AccountPage</h1>
    <Button>Bruh</Button>
    <Dropdown
      items={['NEAR', 'ETH', 'SOL', 'BTC'].map((name) => ({
        label: name,
        value: name,
      }))}
    />
    <div class="mt-8">
      <h3 class="text-2xl text-center">Balances</h3>
      <Listbalances />
    </div>
  </Card>
</Layout>
