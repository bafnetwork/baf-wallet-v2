<script lang="ts">
    import { onDestroy } from 'svelte';
    import { historyStore } from '../state/history.svelte';
    import type { TxHistoryItem } from '../state/history.svelte';

    let history: TxHistoryItem[];
    const unsub = historyStore.subscribe(val => history = val);
    onDestroy(unsub);
</script>

<div>
    <table>
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
                    <td>{item.confirmed.toLocaleString()}</td>
                    <td>{item.recipient}</td>
                    <td>{item.data ?? "--"}</td>
                {/each}
            </tr>
        </tbody>
    </table>
</div>
