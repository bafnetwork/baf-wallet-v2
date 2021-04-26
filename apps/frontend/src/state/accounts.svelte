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

  interface OAuthState {
    verifierId: string;
    name: string;
    email: string;
  }
  export interface AccountState {
    loggedIn: boolean;
    oauthInfo?: OAuthState;
    chainAccounts?: {
      chain: ChainName;
      account: ChainAccount;
      init: boolean;
    }[];
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
    const networkId = getNearNetworkId(constants.env);
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
    const accountState: AccountState = {
      loggedIn,
      oauthInfo: !loggedIn
        ? null
        : JSON.parse(window.localStorage.getItem(oauthInfoStoreName)),
      chainAccounts: !loggedIn
        ? []
        : [
            {
              chain: ChainName.NEAR,
              account: !!nearAccountId
                ? await (await NearAccount.get()).masterAccount
                : null,
              init: nearAccountId !== null && nearAccountId !== "",
            },
          ],
    };
    AccountStore.set(accountState);
    return accountState;
  }
  export function storeOauthState(oauthInfo: OAuthState) {
    window.localStorage.setItem(oauthInfoStoreName, JSON.stringify(oauthInfo));
  }
</script>
