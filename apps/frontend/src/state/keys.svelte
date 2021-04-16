<script lang="ts" context="module">
  import { formatKey, keyFromString } from '@baf-wallet/multi-chain';

  import { writable } from 'svelte/store';
  import { KeyState } from '../interfaces';

  export const SiteKeyStore = writable<KeyState | null>(null);

  function packKey(keyState: KeyState) {
    return `${formatKey(keyState.secp256k1Pubkey)}:${formatKey(
      keyState.ed25519Pubkey
    )}:${formatKey(keyState.secret)}`;
  }

  function unpackKey(keyState: string): KeyState {
    const split = keyState.split(':');
    if (split.length !== 3) {
      throw 'Incorrect packed key in storage';
    }
    return {
      secp256k1Pubkey: keyFromString(split[0]),
      ed25519Pubkey: keyFromString(split[1]),
      secret: keyFromString(split[2]),
    };
  }

  SiteKeyStore.subscribe((keyStore) => {
    const keysStored = window.localStorage.getItem('key-store');
    const stringified = packKey(keyStore);
    if (keysStored !== stringified)
      window.localStorage.setItem('key-store', stringified);
  });

  export function loadKeys() {
    const keysStored = window.localStorage.getItem('key-store');
    SiteKeyStore.set(unpackKey(keysStored));
  }
</script>
