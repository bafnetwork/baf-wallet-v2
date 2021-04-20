<script lang="ts">
  import Input from './base/Input.svelte';
  import Button from './base/Button.svelte';
  import { apiClient } from '../config/api';
  import { ChainUtil, formatKey } from '@baf-wallet/multi-chain';
  import { SiteKeyStore } from '../state/keys.svelte';
  import { KeyFormats } from '@baf-wallet/interfaces';
  import {
    getBafContract,
  } from '@baf-wallet/baf-contract';

  let newAccountId: string;

  async function initNearAccount() {
    const nonce = await getBafContract().getAccountNonce($SiteKeyStore.secpPK);
    const userId = 'lev_s#7844';
    const secpSig = ChainUtil.signSecp256k1(
      $SiteKeyStore.secpSK,
      ChainUtil.createUserVerifyMessage(userId, nonce)
    );

    await apiClient.createNearAccount({
      createNearAccountParams: {
        userID: userId,
        nonce,
        edPubkey: formatKey($SiteKeyStore.edPK, KeyFormats.HEX),
        accountID: newAccountId,
        secpSigS: getBafContract().encodeSecpSig(secpSig),
        edSig: ChainUtil.signEd25519(
          $SiteKeyStore.edSK,
          ChainUtil.createUserVerifyMessage(userId, nonce)
        ).toHex(),
        secpSig: secpSig.toDER('hex'),
      },
    });
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
    <Input bind:value={newAccountId} />
    <Button type="submit">Initialize Account with Near</Button>
  </form>
</div>
