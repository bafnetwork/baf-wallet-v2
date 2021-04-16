<script lang="ts" context="module">
  import {
    ChainAccount,
    ChainName,
    CryptoCurves,
    getNearNetworkId,
  } from '@baf-wallet/interfaces';
  import { NearAccount } from '@baf-wallet/multi-chain';

  import { writable } from 'svelte/store';
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

  // TODO: what do we want to do here??
  export async function initAccount() {
    const keys = loadKeys();
    const loggedIn = loadKeys() !== null;
    const networkId = getNearNetworkId(constants.env);
    await NearAccount.setConfigFrontend({
      networkId: networkId,
      masterAccountId: NearAccount.getAccountNameFromPubkey(
        keys.secpPK,
        CryptoCurves.secp256k1,
        networkId
      ),
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
            },
          ],
    });
  }
</script>
