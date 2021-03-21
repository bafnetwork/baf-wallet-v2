<script lang="ts">
  import type { Balance } from '@baf-wallet/interfaces';
  import { TOKEN } from '@baf-wallet/interfaces';
  import AmountFormatter from './base/AmountFormatter.svelte';

  export const balances: Balance[] = [{ tok: TOKEN.Near, balance: '100000000000000000000000000' }];
</script>

<div class="container mx-auto sm">
  <table class="table-auto">
    <thead>
      <tr>
        <th>Coin</th>
        <th>Balance</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        {#each balances as bal}
          <td class="border text-center">{bal.tok}</td>
          <td class="border text-center">
            <AmountFormatter {bal} />
          </td>
        {/each}
      </tr>
    </tbody>
  </table>
</div>

<style>
  table {
    width: 100%;
  }
</style>
