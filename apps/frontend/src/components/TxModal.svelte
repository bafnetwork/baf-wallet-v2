<script lang="ts">
  import ApproveRedirect from './ApproveRedirect.svelte';

  import { getContext } from 'svelte';
  import { Chain, TokenInfo } from '@baf-wallet/interfaces';
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
