<script lang="ts">
  import {
    encodeSecpSigBafContract,
    getBafContract,
    bafContractConstants,
  } from '@baf-wallet/baf-contract';
  import Button from '../base/Button.svelte';
  import { reinitApp } from '../../config/init.svelte';
  import { AccountStore } from '../../state/accounts.svelte';
  import { SiteKeyStore } from '../../state/keys.svelte';
  import { apiClient } from '../../config/api';
  import { ChainStores, checkChainInit } from '../../state/chains.svelte';
  import { Chain, Encoding } from '@baf-wallet/interfaces';
  import { createUserVerifyMessage } from '@baf-wallet/utils';
  import { signMsg } from '@baf-wallet/crypto';
  import Spinner from 'svelte-spinner';
  
  //TODO: Change to global color vairable. See https://github.com/bafnetwork/baf-wallet-v2/issues/53
  let size = 25;
  let speed = 750;
  let color = '#A82124';
  let thickness = 2.0;
  let gap = 40;

  let isLoading = false;

  async function deleteAccount() {
    isLoading = true;
    if (!checkChainInit($ChainStores, Chain.NEAR)) {
      alert('Cannot delete an unitialized account');
      return;
    }
    const userId = $AccountStore.oauthInfo.verifierId;

    const nonce = await apiClient.getAccountNonce({
      secpPubkeyB58: $SiteKeyStore.secpPK.format(Encoding.BS58),
    });
    const secpSigBafContractEncoded = signMsg(
      $SiteKeyStore.secpSK,
      createUserVerifyMessage(userId, nonce),
      true
    );

    await getBafContract().deleteAccountInfo(
      $SiteKeyStore.secpPK,
      userId,
      secpSigBafContractEncoded
    );
    // Deleteing the account must come after whiping it from the contract
    await $ChainStores[Chain.NEAR]
      .getInner()
      .nearMasterAccount.deleteAccount(bafContractConstants.beneficiaryId);
    isLoading = false;
    alert('Your account was deleted');
    reinitApp();
  }
</script>

<div class="ml-6 p-6">
  {#if isLoading}
    <p>Beep bop beep boop, deleting your account</p>
    <!-- <Loader /> -->
    <Spinner 
      size="{size}"
      speed="{speed}"
      color="{color}"
      thickness="{thickness}"
      gap="{gap}"
    />
  {:else}
    <Button onClick={deleteAccount}>Delete Near Account</Button>
  {/if}
</div>
