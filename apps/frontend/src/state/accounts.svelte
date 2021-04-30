<script lang="ts" context="module">
  import { ChainAccount, Encoding } from '@baf-wallet/interfaces';

  import { writable } from 'svelte/store';
  import { apiClient } from '../config/api';
  import { constants } from '../config/constants';
  import { ChainsState, initChains } from './chains.svelte';
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

  export async function initAccount(): Promise<{
    accountState: AccountState;
    chainsState: ChainsState | null;
  }> {
    const keys = loadKeys();
    const loggedIn = loadKeys() !== null;
    const chainsState = keys ? await initChains(keys) : null;
    const accountState: AccountState = {
      loggedIn,
      oauthInfo: !loggedIn
        ? null
        : JSON.parse(window.localStorage.getItem(oauthInfoStoreName)),
    };
    AccountStore.set(accountState);
    return { accountState, chainsState};
  }

  export function storeOauthState(oauthInfo: OAuthState) {
    window.localStorage.setItem(oauthInfoStoreName, JSON.stringify(oauthInfo));
  }
</script>
