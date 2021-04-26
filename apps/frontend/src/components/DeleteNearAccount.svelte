<script lang="ts">
  import {
    encodeSecpSigBafContract,
    getBafContract,
  } from '@baf-wallet/baf-contract';
  import Button from './base/Button.svelte';

  import { AccountStore } from '../state/accounts.svelte';
  import { SiteKeyStore } from '../state/keys.svelte';
  import { ChainUtil, formatKey } from '@baf-wallet/multi-chain';
  import { apiClient } from '../config/api';
  import { KeyFormats } from '@baf-wallet/interfaces';

  async function deleteAccount() {
    if (!$AccountStore.chainAccounts[0].init) {
      alert('Cannot delete an unitialized account');
      return;
    }
    const userId = 'lev_s#7844';

    const nonce = await apiClient.getAccountNonce({
      secpPubkeyB58: formatKey($SiteKeyStore.secpPK, KeyFormats.BS58),
    });
    const secpSig = ChainUtil.signSecp256k1(
      $SiteKeyStore.secpSK,
      ChainUtil.createUserVerifyMessage(userId, nonce)
    );
    // TODO: factor out benefieciery.
    // TODO: Fn to get account from chain accounts
    // TODO: abstract
    await getBafContract().deleteAccountInfo(
      $SiteKeyStore.secpPK,
      userId,
      encodeSecpSigBafContract(secpSig)
    );
    // Deleteing the account must come after whiping it from the contract
    await $AccountStore.chainAccounts[0].account.deleteAccount(
      'levtester.testnet'
    );
  }
</script>

<div class="ml-6 p-6">
  <Button onClick={deleteAccount}>Delete Near Account</Button>
</div>
