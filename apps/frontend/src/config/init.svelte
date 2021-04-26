<script lang="ts" context="module">
  import { setBafContract } from '@baf-wallet/baf-contract';
  import { initAccount } from '../state/accounts.svelte';
  import { NearAccount } from '@baf-wallet/multi-chain';

  // TODO: we have to improve this to not require a reload, please see
  // https://github.com/bafnetwork/baf-wallet-v2/issues/29
  export async function reinitApp() {
    window.location.reload();
  }
  export async function initApp() {
    const accountState = await initAccount();
    if (accountState.chainAccounts[0].init)
      await setBafContract((await NearAccount.get()).masterAccount);
  }
</script>
