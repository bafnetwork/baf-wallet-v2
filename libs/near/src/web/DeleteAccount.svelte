<script lang="ts">
  import {
    encodeSecpSigBafContract,
    getBafContract,
    bafContractConstants,
  } from '@baf-wallet/baf-contract';
  import Button from '@baf-wallet/base-components/Button.svelte';
  import {
    AccountState,
    Chain,
    Encoding,
    KeyState,
  } from '@baf-wallet/interfaces';
  import { createUserVerifyMessage } from '@baf-wallet/utils';
  import { signMsg } from '@baf-wallet/crypto';
  import { WrappedNearChainInterface } from '@baf-wallet/near';
  import { DefaultApi } from '@baf-wallet/api-client';

  export let keyState: KeyState;
  export let accountState: AccountState;
  export let cb: () => void = () => {};
  export let apiClient: DefaultApi;
  export let chainInterface: WrappedNearChainInterface;

  async function deleteAccount() {
    if (!chainInterface) {
      alert('Cannot delete an unitialized account');
      return;
    }
    const userId = accountState.oauthInfo.verifierId;

    const nonce = await apiClient.getAccountNonce({
      secpPubkeyB58: keyState.secpPK.format(Encoding.BS58),
    });
    const secpSigBafContractEncoded = signMsg(
      keyState.secpSK,
      createUserVerifyMessage(userId, nonce),
      true
    );
    await getBafContract().deleteAccountInfo(
      keyState.secpPK,
      userId,
      secpSigBafContractEncoded
    );
    // Deleteing the account must come after whiping it from the contract
    await chainInterface
      .getInner()
      .nearMasterAccount.deleteAccount(bafContractConstants.beneficiaryId);
    alert('Your account was deleted');
    cb();
  }
</script>

<div>
  <Button onClick={deleteAccount}>Delete Near Account</Button>
</div>
