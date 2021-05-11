<script lang="ts">
  import {
    Chain,
    GenericTxSupportedActions,
    CreateTxReturn,
    ed25519,
    PublicKey,
    GenericTxAction,
    TokenInfo,
  } from '@baf-wallet/interfaces';
  import {
    NearBuildTxParams,
    WrappedNearChainInterface,
  } from '@baf-wallet/near';
  import {
    formatNativeTokenAmountToIndivisibleUnit,
    formatTokenAmountToIndivisibleUnit,
  } from '@baf-wallet/multi-chain';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text/index';

  import { BafError } from '@baf-wallet/errors';

  export let recipientAccountID: string = null,
    amountFormatted: number = NaN;
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

<Textfield
  bind:value={recipientAccountID}
  name="recipientAddress"
  label="Recipient NEAR Account"
  required
>
  <HelperText slot="helper">Ex. johndoe.testnet</HelperText>
</Textfield>
<Textfield
  bind:value={amountFormatted}
  label="$NEAR"
  type="number"
  name="amount"
  required
/>

<svelte:options accessors/>