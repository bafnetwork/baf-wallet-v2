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

  import Input from '@baf-wallet/base-components/Input.svelte';
  import InputNumeric from '@baf-wallet/base-components/InputNumeric.svelte';
  import { utils } from 'near-api-js';
  import BN from 'bn.js';
import { BafError } from '@baf-wallet/errors';
  let recipientAccountID: string, amountNear: number;
  export let chainInterface: WrappedNearChainInterface;
  export let edPK: PublicKey<ed25519>;

  export const createTX = async (): Promise<
    CreateTxReturn<NearBuildTxParams>
  > => {
    if (!chainInterface || !edPK) {
      throw BafError.UninitChain(Chain.NEAR)
    }
    const amountYoctoNearBN = utils.format.NEAR_NOMINATION.muln(amountNear)
    const txParams: NearBuildTxParams = {
      actions: [
        {
          type: GenericTxSupportedActions.TRANSFER,
          amount: amountYoctoNearBN.toString(10),
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
