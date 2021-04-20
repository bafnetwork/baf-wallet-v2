<script lang="ts" context="module">
  import {
    ChainAccount,
    ChainName,
    CryptoCurves,
    getNearNetworkId,
    KeyFormats,
  } from '@baf-wallet/interfaces';
  import { formatKey, NearAccount } from '@baf-wallet/multi-chain';

  import { writable } from 'svelte/store';
  import { apiClient } from '../config/api';
  import { constants } from '../config/constants';
  import { clearKeysFromStorage, loadKeys, SiteKeyStore } from './keys.svelte';
  export interface Account {
    displayName: string;
    pubkey: string;
  }

  export interface AccountState {
    loggedIn: boolean;
    chainAccounts?: {
      chain: ChainName;
      account: ChainAccount;
      init: boolean;
    }[];
  }

  export const AccountStore = writable<AccountState | null>(null);

  export function logout() {
    SiteKeyStore.set(null);
    clearKeysFromStorage();
    AccountStore.update((accountStore) => {
      return {
        ...accountStore,
        loggedIn: false,
      };
    });
  }

  export async function initAccount() {
    const keys = loadKeys();
    const loggedIn = loadKeys() !== null;
    const networkId = getNearNetworkId(constants.env);
    const accountId = await apiClient.getAccountId({
      secpPubkeyB58: formatKey(keys.secpPK, KeyFormats.BS58),
    });
    console.log(accountId)
    await NearAccount.setConfigFrontend({
      networkId: networkId,
      masterAccountId: accountId,
      edSK: keys.edSK,
    });
    AccountStore.set({
      loggedIn,
      chainAccounts: !loggedIn
        ? []
        : [
            {
              chain: ChainName.NEAR,
              account: await (await NearAccount.get()).masterAccount,
              // TODO: idk if this is the best way of doing things
              // its initialized if the account is truthy
              init: !!accountId
            },
          ],
    });
  }
</script>
