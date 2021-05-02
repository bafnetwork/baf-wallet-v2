<script lang="ts">
  import Card from '@baf-wallet/base-components/Card.svelte';
  import XButton from '@baf-wallet/base-components/XButton.svelte';
  import ApproveRedirect from './ApproveRedirect.svelte';

  import { getContext } from 'svelte';
  import { Chain } from '@baf-wallet/interfaces';
  const { close } = getContext('modal');

  export let chain: Chain, txParams: any, recipientUser: string;
</script>

<Card>
  <XButton onClick={close} />
  <ApproveRedirect
    {txParams}
    txInUrl={false}
    {recipientUser}
    isGenericTx={false}
    {chain}
  />
</Card>
