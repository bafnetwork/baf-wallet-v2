<script lang="ts" context="module">
    import { writable } from 'svelte/store';
    export interface Account {
        displayName: string,
        pubkey: string
    }

    export interface AccountState {
        loggedIn: boolean,
        byPubkey: {
            [pubkey: string]: Account 
        },
        byDisplayName: {
            [displayName: string]: Account
        }
    }
  
    export const AccountStore = writable<AccountState>({
        loggedIn: true,
        byPubkey: {
            "0xDEADEEF": {
                displayName: "lev.near",
                pubkey: "OxDEADBEEF",
            }
        },
        byDisplayName: {
            "lev.near": {
                displayName: "lev.near",
                pubkey: "OxDEADBEEF",
            }
        }
    });
  </script>
