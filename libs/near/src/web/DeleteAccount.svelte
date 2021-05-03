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
  import Spinner from 'svelte-spinner';

  //TODO: Change to global color vairable. See https://github.com/bafnetwork/baf-wallet-v2/issues/53
  let size = 25;
  let speed = 750;
  let color = '#A82124';
  let thickness = 2.0;
  let gap = 40;

  let isLoading = false;

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
    isLoading = true;
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
    isLoading = false;
    alert('Your account was deleted');
    cb();
  }
</script>

<div>
  {#if isLoading}
    <p>Beep bop beep boop, deleting your account</p>
    <!-- <Loader /> -->
    <Spinner {size} {speed} {color} {thickness} {gap} />
  {:else}
    <Button onClick={deleteAccount}>Delete Near Account</Button>
  {/if}
</div>
