<script lang="ts" context="module">
  import { ChainAccount } from '@baf-wallet/interfaces';

  import { writable } from 'svelte/store';
  import { apiClient } from '../config/api';
  import { constants } from '../config/constants';
  import { initChains } from './chains.svelte';
  import { clearKeysFromStorage, loadKeys, SiteKeyStore } from './keys.svelte';
  export interface Account {
    displayName: string;
    pubkey: string;
  }

  interface OAuthState {
    verifierId: string;
    name: string;
    email: string;
  }

  export interface AccountState {
    loggedIn: boolean;
    oauthInfo?: OAuthState;
  }

  export const AccountStore = writable<AccountState | null>(null);
  const oauthInfoStoreName = 'oauthInfo';

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

  export async function initAccount(): Promise<AccountState> {
    const keys = loadKeys();
    const loggedIn = loadKeys() !== null;
    await initChains(keys);
    const nearAccountId = loggedIn
      ? (
          await apiClient.getAccountInfo({
            secpPubkeyB58: formatKey(keys.secpPK, KeyFormats.BS58),
          })
        ).nearId
      : '';
    if (nearAccountId)
      await NearAccount.setConfigFrontend({
        networkId: networkId,
        masterAccountId: nearAccountId,
        edSK: keys.edSK,
      });
    const chainInfos = {};
    chainInfos[ChainName.NEAR] = {
      account: !!nearAccountId
        ? await (await NearAccount.get()).masterAccount
        : null,
      init: nearAccountId !== null && nearAccountId !== '',
    };
    const accountState: AccountState = {
      loggedIn,
      oauthInfo: !loggedIn
        ? null
        : JSON.parse(window.localStorage.getItem(oauthInfoStoreName)),
      chainInfos,
    };
    AccountStore.set(accountState);
    return accountState;
  }

  export function storeOauthState(oauthInfo: OAuthState) {
    window.localStorage.setItem(oauthInfoStoreName, JSON.stringify(oauthInfo));
  }
</script>
