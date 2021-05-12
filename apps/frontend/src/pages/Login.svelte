<script lang="ts">
  import Layout from '../components/Layout.svelte';
  import Auth from '../components/Auth.svelte';
  import { AccountStore } from '../state/accounts.svelte';
  import { SiteKeyStore } from '../state/keys.svelte';
  import { BafError } from '@baf-wallet/errors';
  import { NearChainInterface, getNearNetworkID } from'@baf-wallet/near';
  import { Chain, Encoding } from '@baf-wallet/interfaces';
  import { getWrappedInterface } from '@baf-wallet/multi-chain';
  import { apiClient } from '../config/api';
import { signMsg } from '@baf-wallet/crypto';
import { createUserVerifyMessage, formatBytes } from '@baf-wallet/utils';

  enum FlowState {
    OAUTH,
    NEAR_NAME,
    LOADING,
    PROCEED,
    ERROR
  };

  let state: FlowState = FlowState.OAUTH;
  let newAccountID: string;
  let error: Error;
  
  async function initNearAccount() {
    const keyState = $SiteKeyStore;
    if (!keyState) {
      error = BafError.MissingKeyPair();
      state = FlowState.ERROR;
      return;
    }
    const accountState = $AccountStore;
    if (!accountState) {
      error = new Error("AccountState must not be null when near account is initialized!");
      state = FlowState.ERROR;
      return;
    }

    state = FlowState.LOADING

    const nonce = await apiClient.getAccountNonce({
      secpPubkeyB58: keyState.secpPK.format(Encoding.BS58),
    });

    const userId = accountState.oauthInfo.verifierId;

    const edSig = signMsg(
      keyState.edSK,
      createUserVerifyMessage(userId, nonce)
    );
    const secpSigBafEncoded = signMsg(
      keyState.secpSK,
      createUserVerifyMessage(userId, nonce),
      true
    );
    const secpSig = signMsg(
      keyState.secpSK,
      createUserVerifyMessage(userId, nonce)
    );

    await apiClient.createNearAccount({
      createNearAccountParams: {
        userID: userId,
        nonce,
        edPubkey: keyState.edPK.format(Encoding.HEX),
        accountID: newAccountID,
        secpSigS: formatBytes(secpSigBafEncoded, Encoding.HEX),
        edSigHex: formatBytes(edSig, Encoding.HEX),
        secpSigHex: formatBytes(secpSig, Encoding.HEX),
      },
    });

    alert('Success');
    state = FlowState.PROCEED;
  }
</script>

<Layout>
  {#if state === FlowState.OAUTH}
    <Auth />
  {:else if state === FlowState.NEAR_NAME}
    <NearNameForm bind:accountID={newAccountID} on:submit={initNearAccount}/>
  {:else if state === FlowState.LOADING || state === FlowState.PROCEED}
    <!-- loading wheel -->
    <!-- if we're in LOADING, grey out proceed button and give a "One moment please" message -->
    <!-- if we're in PROCEED, activate proceed button and give a "Welcome ACCOUNT_NAME" message -->
  {:else}
    <!-- display the error message, say something corresponding to the error if we're in ERROR, otherwise just say something generic -->
  {/if}
</Layout>

<style>
</style>
