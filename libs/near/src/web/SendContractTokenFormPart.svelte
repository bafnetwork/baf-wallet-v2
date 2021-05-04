<script lang="ts">
  import {
    Chain,
    GenericTxSupportedActions,
    CreateTxReturn,
    ed25519,
    PublicKey,
  } from '@baf-wallet/interfaces';
  import {
    NearBuildTxParams,
    WrappedNearChainInterface,
  } from '@baf-wallet/near';
  import { formatAmountToIndivisibleUnit } from '@baf-wallet/multi-chain';

  import Input from '@baf-wallet/base-components/Input.svelte';
  import InputNumeric from '@baf-wallet/base-components/InputNumeric.svelte';
  import { BafError } from '@baf-wallet/errors';
  let recipientAccountID: string, amountNear: number;
  export let chainInterface: WrappedNearChainInterface;
  export let edPK: PublicKey<ed25519>;

  export const createTX = async (): Promise<
    CreateTxReturn<NearBuildTxParams>
  > => {
    if (!chainInterface || !edPK) {
      throw BafError.UninitChain(Chain.NEAR);
    }
    const amountYoctoNear = formatAmountToIndivisibleUnit(
      amountNear,
      Chain.NEAR
    );
    const txParams: NearBuildTxParams = {
      actions: [
        {
          type: GenericTxSupportedActions.TRANSFER,
          amount: amountYoctoNear,
        },
      ],
      senderPk: edPK,
      senderAccountID: chainInterface.getInner().nearMasterAccount.accountId,
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
  bind:value={amountNear}
  required={true}
/>
