<script lang="ts">
  import { Chain, GenericTxSupportedActions, CreateTxReturn } from '@baf-wallet/interfaces';
  import { NearBuildTxParams } from '@baf-wallet/near';

  import { ChainStores, checkChainInit } from '../../state/chains.svelte';
  import { SiteKeyStore } from '../../state/keys.svelte';

  import Input from '../base/Input.svelte';
  import InputNumeric from '../base/InputNumeric.svelte';
  let recipientAccountID: string, amount: number;
  export const createTX = async (): Promise<
    CreateTxReturn<NearBuildTxParams>
  > => {
    if (!checkChainInit($ChainStores, Chain.NEAR)) {
      throw 'You must have an initialized account with NEAR';
    }
    const txParams: NearBuildTxParams = {
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
    };
    return { txParams, recipientUser: recipientAccountID };
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
