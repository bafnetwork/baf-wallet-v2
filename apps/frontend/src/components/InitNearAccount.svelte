<script lang="ts">
  import Input from './base/Input.svelte';
  import Button from './base/Button.svelte';
  import { apiClient } from '../config/api';
  import { ChainUtil, formatKey } from '@baf-wallet/multi-chain';
  import { SiteKeyStore } from '../state/keys.svelte';
  import { KeyFormats } from '@baf-wallet/interfaces';
  import {
    encodeSecpSigBafContract,
  } from '@baf-wallet/baf-contract';

  let newAccountId: string;

  async function initNearAccount() {
    const nonce = await apiClient.getAccountNonce({
      secpPubkeyB58: formatKey($SiteKeyStore.secpPK, KeyFormats.BS58)
    })
    console.log(formatKey($SiteKeyStore.secpPK, KeyFormats.HEX))
    const userId = '473198585890996224';
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
        secpSigS:  encodeSecpSigBafContract(secpSig),
        edSig: ChainUtil.signEd25519(
          $SiteKeyStore.edSK,
          ChainUtil.createUserVerifyMessage(userId, nonce)
        ),
        secpSig: secpSig.toDER('hex'),
      },
    });
    alert('Success')
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
    <Input label="Account ID" placeholder="john.doe.testnet" bind:value={newAccountId} />
    <Button type="submit">Initialize Account with Near</Button>
  </form>
</div>
