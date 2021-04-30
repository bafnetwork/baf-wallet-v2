<script lang="ts">
  import { Chain, GenericTxSupportedActions } from '@baf-wallet/interfaces';
  import { NearTransaction } from '@baf-wallet/near';

  import { ChainStores, checkChainInit } from '../../state/chains.svelte';
  import { SiteKeyStore } from '../../state/keys.svelte';

  import Button from './base/Button.svelte';
  import Input from './base/Input.svelte';
  import InputNumeric from './base/InputNumeric.svelte';
  let recipientAccountID: string, amount: number;
  export const createTX = async (): Promise<NearTransaction> => {
    if (!checkChainInit($ChainStores, Chain.NEAR)) {
      throw 'You must have an initialized account with NEAR';
    }
    const tx = await $ChainStores[Chain.NEAR].tx.build({
      actions: [
        {
          type: GenericTxSupportedActions.TRANSFER,
          amount: amount.toString(),
        },
      ],
      senderPk: $SiteKeyStore.edPK,
      senderAccountID: $ChainStores[Chain.NEAR].getInner().nearMasterAccount
        .accountId,
      recipientAccountID,
    });
    return tx;
  };
</script>

<Input
  label="Sending to"
  placeholder="JohnDoe.near"
  bind:value={recipientAccountID}
  required={true}
/>
<InputNumeric
  label="Sending to"
  placeholder="0 Near"
  bind:value={amount}
  required={true}
/>
