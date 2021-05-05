<script lang="ts">
  import {
    Chain,
    GenericTxSupportedActions,
    CreateTxReturn,
    ed25519,
    PublicKey,
    GenericTxAction,
  } from '@baf-wallet/interfaces';
  import {
    NearBuildTxParams,
    WrappedNearChainInterface,
  } from '@baf-wallet/near';
  import {
    formatNativeTokenAmountToIndivisibleUnit,
    formatTokenAmountToIndivisibleUnit,
  } from '@baf-wallet/multi-chain';
  import { TokenInfo } from '@baf-wallet/trust-wallet-assets';
  import Input from '@baf-wallet/base-components/Input.svelte';
  import InputNumeric from '@baf-wallet/base-components/InputNumeric.svelte';
  import { BafError } from '@baf-wallet/errors';

  let recipientAccountID: string, amountFormatted: number;
  export let chainInterface: WrappedNearChainInterface;
  export let edPK: PublicKey<ed25519>;
  export let tokenInfo: TokenInfo;

  export let isContractToken = false;
  export let contractAddress: string;

  export const createTX = async (): Promise<
    CreateTxReturn<NearBuildTxParams>
  > => {
    if (!chainInterface || !edPK) {
      throw BafError.UninitChain(Chain.NEAR);
    }
    const action: GenericTxAction = isContractToken
      ? {
          type: GenericTxSupportedActions.TRANSFER_CONTRACT_TOKEN,
          amount: formatTokenAmountToIndivisibleUnit(
            amountFormatted,
            tokenInfo.decimals
          ),
          contractAddress: contractAddress,
        }
      : {
          type: GenericTxSupportedActions.TRANSFER,
          amount: formatNativeTokenAmountToIndivisibleUnit(
            amountFormatted,
            Chain.NEAR
          ),
        };
    const txParams: NearBuildTxParams = {
      actions: [action],
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
  label="Amount"
  placeholder={`0 ${tokenInfo.name}`}
  bind:value={amountFormatted}
  required={true}
/>
