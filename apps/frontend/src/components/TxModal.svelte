<script lang="ts">
  import ApproveRedirect from './ApproveRedirect.svelte';

  import { getContext } from 'svelte';
  import { Chain } from '@baf-wallet/interfaces';
  import { TokenInfo } from '@baf-wallet/chain-info';
  const { close } = getContext('modal');

  export let chain: Chain,
    txParams: any,
    recipientUser: string,
    tokenInfo: TokenInfo;
</script>

<ApproveRedirect
  {txParams}
  {tokenInfo}
  txInUrl={false}
  {recipientUser}
  isGenericTx={false}
  {chain}
  onCancel={close}
/>
