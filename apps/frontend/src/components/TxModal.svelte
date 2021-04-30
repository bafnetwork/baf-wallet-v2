<script lang="ts">
  import Card from './base/Card.svelte';
  import XButton from './base/XButton.svelte';
  import ApproveRedirect from './ApproveRedirect.svelte';

  import { getContext } from 'svelte';
  import { Chain } from '@baf-wallet/interfaces';
  const { close } = getContext('modal');

  export let chain: Chain, txParams: any, recipientUser: string;
</script>

<Card classExtra="w-1/2 flex flex-col relative">
  <XButton onClick={close} />
  <ApproveRedirect
    {txParams}
    txInUrl={false}
    {recipientUser}
    isGenericTx={false}
    {chain}
  />
</Card>
