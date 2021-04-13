<script lang="ts">
  // import { crossfade } from "svelte/types/runtime/transition";
  import Button from '../components/base/Button.svelte';
  import Card from '../components/base/Card.svelte';
  import Dropdown from '../components/base/Dropdown.svelte';
  import Layout from '../components/Layout.svelte';
  import Listbalances from '../components/Listbalances.svelte';
  import SendForm from '../components/SendForm.svelte';
  import SendModal from '../components/SendModal.svelte';
  import TxModal from '../components/TxModal.svelte';

  import { getContext } from 'svelte';
  const { open } = getContext('modal');

  const openSendModal = () => {
    open(SendModal);
  };

  const openTxModal = () => {
    open(TxModal, { txLink: "https://explorer.near.org/"});
  }
</script>

<Layout>
  <Card>
    <h1 class="text-4xl">AccountPage</h1>
    <Button onClick={openSendModal}>Open SendModal</Button>
    <Button onClick={openTxModal}>Open TxModal</Button>
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
    <div class="mt-8">
      <SendForm />
    </div>
  </Card>
</Layout>
