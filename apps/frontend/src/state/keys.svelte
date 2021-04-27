<script lang="ts" context="module">
  import { ed25519, ed25519Marker, Encoding, secp256k1, secp256k1Marker, SecretKey } from '@baf-wallet/interfaces';

  import {
    pkFromSk,
    skFromSeed,
  } from '@baf-wallet/multi-chain';

  import { bufferConverter, encodeBytes } from '@baf-wallet/utils';
  import { writable } from 'svelte/store';

  const keyStoreName = 'key-store';

  export const SiteKeyStore = writable<KeyState | null>(null);

  export function buildKeyStateFromSecpSk(secpSk: SecretKey<secp256k1>): KeyState {
    const edSk = skFromSeed<ed25519>(secpSk.data, ed25519Marker);
    return {
      edSk,
      secpSk,
      edPk: pkFromSk(edSk),
      secpPk: pkFromSk(secpSk),
    };
  }
  export function packKey(keyState: KeyState): string {
    return `secp256k1:${keyState.secpSk.format(Encoding.HEX)}`;
  }

  function unpackKey(keyState: string): KeyState {
    const split = keyState.split(':');
    if (split.length !== 2) {
      throw 'Incorrect packed key in storage';
    } else if (split[0] !== 'secp256k1') {
      throw 'Only secp256k1 keys are supported as base keys right not';
    }
    const keyBytes = encodeBytes(split[1], Encoding.HEX);
    return buildKeyStateFromSecpSk(bufferConverter.skToUnified(keyBytes, secp256k1Marker));
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

  export function loadKeys(): KeyState | null {
    const keysStored = window.localStorage.getItem(keyStoreName);
    if (!keysStored) return null;
    const keysParse = unpackKey(keysStored);
    SiteKeyStore.set(keysParse);
    return keysParse;
  }
</script>
