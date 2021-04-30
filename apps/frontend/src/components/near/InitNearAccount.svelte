<script lang="ts">
  import Input from '../base/Input.svelte';
  import Button from '../base/Button.svelte';
  import { reinitApp } from '../../config/init.svelte';
  import { apiClient } from '../../config/api';
  import { SiteKeyStore } from '../../state/keys.svelte';
  import { AccountStore } from '../../state/accounts.svelte';
  import { Encoding } from '@baf-wallet/interfaces';
  import { createUserVerifyMessage, formatBytes } from '@baf-wallet/utils';
  import { signMsg } from '@baf-wallet/multi-chain';

  let newAccountId: string;

  async function initNearAccount() {
    const nonce = await apiClient.getAccountNonce({
      secpPubkeyB58: $SiteKeyStore.secpPK.format(Encoding.BS58),
    });
    const userId = $AccountStore.oauthInfo.verifierId;
    const edSig = signMsg(
      $SiteKeyStore.edSK,
      createUserVerifyMessage(userId, nonce)
    );
    const secpSigBafEncoded = signMsg(
      $SiteKeyStore.secpSK,
      createUserVerifyMessage(userId, nonce),
      true
    );
    const secpSig = signMsg(
      $SiteKeyStore.secpSK,
      createUserVerifyMessage(userId, nonce)
    );

    await apiClient.createNearAccount({
      createNearAccountParams: {
        userID: userId,
        nonce,
        edPubkey: $SiteKeyStore.edPK.format(Encoding.HEX),
        accountID: newAccountId,
        secpSigS: formatBytes(secpSigBafEncoded, Encoding.HEX),
        edSigHex: formatBytes(edSig, Encoding.HEX),
        secpSigHex: formatBytes(secpSig, Encoding.HEX),
      },
    });
    alert('Success');
    reinitApp();
  }
</script>

<div class="container z-6 p-4 m-4">
  <form
    action=""
    on:submit={(e) => {
      e.preventDefault();
      initNearAccount();
    }}
  >
    <Input
      label="Account ID"
      placeholder="john.doe.testnet"
      bind:value={newAccountId}
    />
    <Button type="submit">Initialize Account with Near</Button>
  </form>
</div>
