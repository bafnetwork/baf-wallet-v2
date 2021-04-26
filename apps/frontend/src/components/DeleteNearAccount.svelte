<script lang="ts">
  import {
    encodeSecpSigBafContract,
    getBafContract,
    bafContractConstants,
  } from '@baf-wallet/baf-contract';
  import Button from './base/Button.svelte';
  import { reinitApp } from '../config/init.svelte';
  import { AccountStore } from '../state/accounts.svelte';
  import { SiteKeyStore } from '../state/keys.svelte';
  import { ChainUtil, formatKey } from '@baf-wallet/multi-chain';
  import { apiClient } from '../config/api';
  import { ChainName, KeyFormats } from '@baf-wallet/interfaces';

  async function deleteAccount() {
    if (!$AccountStore.chainInfos[ChainName.NEAR]) {
      alert('Cannot delete an unitialized account');
      return;
    }
    const userId = $AccountStore.oauthInfo.verifierId;

    const nonce = await apiClient.getAccountNonce({
      secpPubkeyB58: formatKey($SiteKeyStore.secpPK, KeyFormats.BS58),
    });
    const secpSig = ChainUtil.signSecp256k1(
      $SiteKeyStore.secpSK,
      ChainUtil.createUserVerifyMessage(userId, nonce)
    );
    await getBafContract().deleteAccountInfo(
      $SiteKeyStore.secpPK,
      userId,
      encodeSecpSigBafContract(secpSig)
    );
    // Deleteing the account must come after whiping it from the contract
    await $AccountStore.chainInfos[ChainName.NEAR].account.deleteAccount(
      bafContractConstants.beneficiaryId
    );
    alert('Your account was deleted');
    reinitApp();
  }
</script>

<div class="ml-6 p-6">
  <Button onClick={deleteAccount}>Delete Near Account</Button>
</div>
