<script lang="ts" context="module">
  import { LOGIN_TYPE as TORUS_LOGIN_TYPE } from '@toruslabs/torus-direct-web-sdk';

  import { writable } from 'svelte/store';
  import { clearKeysFromStorage, loadKeys, SiteKeyStore } from './keys.svelte';
  export interface Account {
    displayName: string;
    pubkey: string;
  }

  interface AccessToken {
    type: TORUS_LOGIN_TYPE;
    token: string;
    dateIssued: Date;
  }

  export interface AccountState {
    accessToken: AccessToken | null;
    loggedIn: boolean;
    byPubkey: {
      [pubkey: string]: Account;
    };
    byDisplayName: {
      [displayName: string]: Account;
    };
  }

  export function storeAccessToken(accessToken: AccessToken) {
    window.localStorage.setItem(`access-token`, JSON.stringify(accessToken));
  }

  function getAccessToken(): AccessToken | null {
    const stored = window.localStorage.getItem('access-token');
    return stored ? (JSON.parse(stored) as AccessToken) : null;
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

  // TODO: what do we want to do here??
  export async function initAccount() {
    const loggedIn = loadKeys();
    AccountStore.set({
      accessToken: getAccessToken(),
      loggedIn,
      byPubkey: {
        '0xDEADEEF': {
          displayName: 'lev.near',
          pubkey: 'OxDEADBEEF',
        },
      },
      byDisplayName: {
        'lev.near': {
          displayName: 'lev.near',
          pubkey: 'OxDEADBEEF',
        },
      },
    });
  }
</script>
