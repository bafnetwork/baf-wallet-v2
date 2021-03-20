<script>
    // import { crossfade } from "svelte/types/runtime/transition";
    import Button from "../components/Button.svelte";
    import Card from "../components/Card.svelte"
    import Dropdown from "../components/Dropdown.svelte";
    import Layout from "../components/Layout.svelte";
</script>

<Layout>
    <Card>
        <h1 class="text-4xl">AccountPage</h1>
        <Button>Bruh</Button>
        <Dropdown items={['NEAR', 'ETH', 'SOL', 'BTC'].map(name => ({label: name, value: name}))}></Dropdown>
    </Card>
</Layout>

