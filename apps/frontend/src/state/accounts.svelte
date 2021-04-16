<script lang="ts" context="module">
  import { LOGIN_TYPE as TORUS_LOGIN_TYPE } from '@toruslabs/torus-direct-web-sdk';

  import { writable } from 'svelte/store';
  export interface Account {
    displayName: string;
    pubkey: string;
  }

  interface AccessToken {
    type: TORUS_LOGIN_TYPE;
    token: string
  }

  export interface AccountState {
    accessToken?: AccessToken;
    loggedIn: boolean;
    byPubkey: {
      [pubkey: string]: Account;
    };
    byDisplayName: {
      [displayName: string]: Account;
    };
  }

  export const AccountStore = writable<AccountState>({
    loggedIn: true,
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
</script>
