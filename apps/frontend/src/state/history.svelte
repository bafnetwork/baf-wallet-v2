<script lang="ts" context="module">
    import { writable } from 'svelte/store';

    export interface TxHistoryItem {
        recipient: string;
        data: string;
        sent: Date;
        confirmed: Date;
    }

    // TODO: somehow fetch tx history

    export const historyStore = writable<TxHistoryItem[]>([]);
</script>
  