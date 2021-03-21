<script lang="ts" context="module">
  import { writable } from 'svelte/store';
  import type { KeyState } from '@baf-wallet/interfaces';

  export const KeyStore = writable<KeyState | null>(null);
</script>
