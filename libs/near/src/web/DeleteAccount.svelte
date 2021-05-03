<script lang="ts">
  import {
    encodeSecpSigBafContract,
    getBafContract,
    bafContractConstants,
  } from '@baf-wallet/baf-contract';
  import Button from '@baf-wallet/base-components/Button.svelte';
  import { reinitApp } from '../../../config/init.svelte';
  import { AccountStore } from '../../../state/accounts.svelte';
  import { SiteKeyStore } from '../../../state/keys.svelte';
  import { apiClient } from '../../../config/api';
  import { ChainStores, checkChainInit } from '../../../state/chains.svelte';
  import { Chain, Encoding } from '@baf-wallet/interfaces';
  import { createUserVerifyMessage } from '@baf-wallet/utils';
  import { signMsg } from '@baf-wallet/crypto';

  async function deleteAccount() {
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
    alert('Your account was deleted');
    reinitApp();
  }
</script>

<div>
  <Button onClick={deleteAccount}>Delete Near Account</Button>
</div>
