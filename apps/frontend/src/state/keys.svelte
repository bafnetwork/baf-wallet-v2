<script lang="ts" context="module">
  import { writable } from 'svelte/store';
  import type { KeyState } from '../interfaces';

  export const KeyStore = writable<KeyState | null>(null);
</script>
