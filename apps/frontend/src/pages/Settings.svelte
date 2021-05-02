<script lang="ts">
  import Layout from '../components/Layout.svelte';
  import ChainSettings from '../components/chains/ChainSettings.svelte';
  import Button from '../components/base/Button.svelte';
  import { saveAs } from 'file-saver';
  import { packKey, SiteKeyStore } from '../state/keys.svelte';

  function downloadKeys() {
    const key = packKey($SiteKeyStore);
    const fileToSave = new Blob([JSON.stringify(key)], {
      type: 'application/json',
    });
    saveAs(fileToSave, 'baf-wallet.json');
  }
</script>

<Layout>
  <ChainSettings />
  <div>
    <h3>Danger Zone</h3>
    <div>
      <Button onClick={downloadKeys}>Download your keys</Button>
    </div>
  </div>
</Layout>
