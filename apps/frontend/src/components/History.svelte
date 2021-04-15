<script lang="ts">
    import { onDestroy } from 'svelte';
    import { historyStore } from '../state/history.svelte';
    import type { TxHistoryItem } from '../state/history.svelte';

    let history: TxHistoryItem[];
    const unsub = historyStore.subscribe(val => history = val);
    onDestroy(unsub);
</script>

<div class="container mx-auto sm">
    <table class="w-full table-auto">
        <thead>
            <tr>
                <th>Date</th>
                <th>Recipient</th>
                <th>Data</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                {#each history as item}
                    <td class="text-center border">{item.confirmed.toLocaleString()}</td>
                    <td class="text-center border">{item.recipient}</td>
                    <td class="text-center border">{item.data ?? "--"}</td>
                {/each}
            </tr>
        </tbody>
    </table>
</div>
