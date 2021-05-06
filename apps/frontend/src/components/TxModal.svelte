<script lang="ts">
  import Card from '@baf-wallet/base-components/Card.svelte';
  import XButton from '@baf-wallet/base-components/XButton.svelte';
  import ApproveRedirect from './ApproveRedirect.svelte';

  import { getContext } from 'svelte';
  import { Chain } from '@baf-wallet/interfaces';
import { TokenInfo } from '@baf-wallet/trust-wallet-assets';
  const { close } = getContext('modal');

  export let chain: Chain, txParams: any, recipientUser: string, tokenInfo: TokenInfo;
</script>

<Card>
  <XButton onClick={close} />
  <ApproveRedirect
    {txParams}
    {tokenInfo}
    txInUrl={false}
    {recipientUser}
    isGenericTx={false}
    {chain}
  />
</Card>
