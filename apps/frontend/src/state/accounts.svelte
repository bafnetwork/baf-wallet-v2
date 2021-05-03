<script lang="ts" context="module">
  import { writable } from 'svelte/store';
  import { ChainsState, initChains } from './chains.svelte';
  import { clearKeysFromStorage, loadKeys, SiteKeyStore } from './keys.svelte';
  import { AccountState, OAuthState } from '@baf-wallet/interfaces';
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

  export function storeTorusAccessToken(accessToken: string) {
    window.localStorage.setItem('accessToken', accessToken);
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
    return { accountState, chainsState };
  }

  export function storeOauthState(oauthInfo: OAuthState) {
    window.localStorage.setItem(oauthInfoStoreName, JSON.stringify(oauthInfo));
  }
</script>
