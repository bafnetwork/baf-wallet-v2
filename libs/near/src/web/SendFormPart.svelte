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
  import { tokenAmountToIndivisible } from '@baf-wallet/utils';
  import { TokenInfo } from '@baf-wallet/chain-info';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text/index';

  import { BafError } from '@baf-wallet/errors';

  let recipientAccountID: string = null,
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
          amount: tokenAmountToIndivisible(amountFormatted, tokenInfo.decimals),
          contractAddress: contractAddress,
        }
      : {
          type: GenericTxSupportedActions.TRANSFER,
          amount: tokenAmountToIndivisible(amountFormatted, tokenInfo.decimals),
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
  label="Recipient NEAR Account"
  required
>
  <HelperText slot="helper">Ex. johndoe.testnet</HelperText>
</Textfield>
<Textfield bind:value={amountFormatted} label="$NEAR" type="number" required />
