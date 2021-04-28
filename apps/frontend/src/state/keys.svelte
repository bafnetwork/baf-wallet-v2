<script lang="ts" context="module">
  import { ed25519, ed25519Marker, Encoding, KeyState, secp256k1, secp256k1Marker, SecretKey } from '@baf-wallet/interfaces';

  import {
    pkFromSk,
    skFromSeed,
  } from '@baf-wallet/multi-chain';

  import { bufferConverter, encodeBytes } from '@baf-wallet/utils';
  import { writable } from 'svelte/store';

  const keyStoreName = 'key-store';

  export const SiteKeyStore = writable<KeyState | null>(null);

  export function buildKeyStateFromSecpSk(secpSK: SecretKey<secp256k1>): KeyState {
    const edSK = skFromSeed<ed25519>(secpSK.data, ed25519Marker);
    return {
      edSK,
      secpSK,
      edPK: pkFromSk(edSK),
      secpPK: pkFromSk(secpSK),
    };
  }
  export function packKey(keyState: KeyState): string {
    return `secp256k1:${keyState.secpSK.format(Encoding.HEX)}`;
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
