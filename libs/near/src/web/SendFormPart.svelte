<script lang="ts">
  import { Chain, GenericTxSupportedActions, CreateTxReturn, ed25519, PublicKey } from '@baf-wallet/interfaces';
  import { NearBuildTxParams, WrappedNearChainInterface } from '@baf-wallet/near';

  import Input from '@baf-wallet/base-components/Input.svelte';
  import InputNumeric from '@baf-wallet/base-components/InputNumeric.svelte';
  let recipientAccountID: string, amount: number;
  export let chainInterface: WrappedNearChainInterface
  export let edPK: PublicKey<ed25519>

  export const createTX = async (): Promise<
    CreateTxReturn<NearBuildTxParams>
  > => {
    if (!chainInterface || !edPK) {
      throw new Error('You must have an initialized account with NEAR');
    }
    const txParams: NearBuildTxParams = {
      actions: [
        {
          type: GenericTxSupportedActions.TRANSFER,
          amount: amount.toString(),
        },
      ],
      senderPk: edPK,
      senderAccountID: chainInterface.getInner().nearMasterAccount
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
