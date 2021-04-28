<script lang="ts" context="module">
  import { setBafContract } from '@baf-wallet/baf-contract';
  import { Chain } from '@baf-wallet/interfaces';
  import { initAccount } from '../state/accounts.svelte';
  import { checkChainInit } from '../state/chains.svelte';

  // TODO: we have to improve this to not require a reload, please see
  // https://github.com/bafnetwork/baf-wallet-v2/issues/29
  export async function reinitApp() {
    window.location.reload();
  }
  export async function initApp() {
    const { chainsState } = await initAccount();
    if (checkChainInit(chainsState, Chain.NEAR))
      await setBafContract(
        chainsState[Chain.NEAR].getInner().nearMasterAccount
      );
  }
</script>
