<script lang="ts" context="module">
  import { KeyFormats, PublicKey, SecretKey } from '@baf-wallet/interfaces';

  import {
    edPubkeyFromSK,
    edSKFromSeed,
    secpPubkeyFromSK,
    keyFromString,
    formatKey,
  } from '@baf-wallet/multi-chain';

  import { writable } from 'svelte/store';
  import { KeyState } from '../interfaces';

  const keyStoreName = 'key-store';

  export const SiteKeyStore = writable<KeyState | null>(null);

  export function packKey(keyState: KeyState): string {
    return `secp256k1:${formatKey(keyState.secpSK, KeyFormats.HEX)}`;
  }

  export function buildKeyStateFromSecpSK(secpSK: SecretKey, secpPK?: PublicKey): KeyState {
    const edSK = edSKFromSeed(new Uint8Array(secpSK));
    return {
      edSK,
      secpSK,
      edPK: edPubkeyFromSK(edSK),
      secpPK: secpPK || secpPubkeyFromSK(secpSK),
    };
  }

  function unpackKey(keyState: string): KeyState {
    const split = keyState.split(':');
    if (split.length !== 2) {
      throw 'Incorrect packed key in storage';
    } else if (split[0] !== 'secp256k1') {
      throw 'Only secp256k1 keys are supported as base keys right not';
    }
    return buildKeyStateFromSecpSK(keyFromString(split[1], KeyFormats.HEX));
  }

  export function clearKeysFromStorage() {
    window.localStorage.setItem(keyStoreName, '');
  }

  SiteKeyStore.subscribe((keyStore) => {
    if (!keyStore) {
      return;
    }
    const keysStored = window.localStorage.getItem(keyStoreName);
    const stringified = packKey(keyStore);
    if (keysStored !== stringified)
      window.localStorage.setItem(keyStoreName, stringified);
  });

  /**
   * @returns true if the user is logged in
   */
  export function loadKeys(): boolean {
    const keysStored = window.localStorage.getItem(keyStoreName);
    if (!keysStored) return false;
    const keysParse = unpackKey(keysStored);
    SiteKeyStore.set(keysParse);
    return true;
  }
</script>
