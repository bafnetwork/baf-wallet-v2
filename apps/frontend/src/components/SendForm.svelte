<script lang="ts">
  import { getContext } from 'svelte';
  import { form } from 'svelte-forms';
  import { Chain, CreateTxReturn } from '@baf-wallet/interfaces';
  import Button from './base/Button.svelte';
  import TxModal from './TxModal.svelte';
  import SendNearFormPart from './near/SendNearFormPart.svelte';
  import { NearBuildTxParams } from '@baf-wallet/near';

  import { ChainBalance } from '@baf-wallet/interfaces';
  import { ChainInfo } from '@baf-wallet/trust-wallet-assets';
  import { ChainStores } from '../state/chains.svelte';
  import trustWalletAssets from '../trust-wallet-assets';
  import SendModal from './SendModal.svelte';
import { transfer } from 'near-api-js/lib/transaction';

  let createTX: <T>() => Promise<CreateTxReturn<T>>; 
  export let postSubmitHook: () => void | undefined;
  export let onCancel: () => void | undefined;
  export let chain: Chain;

  const { open } = getContext('modal');
  let amount : number = 0;
  let recipientAccountID : string = "";

  
  const transactionForm = form(
    () => ({
      recipientAccountID: {value: recipientAccountID, validators: ["required"]},
      amount: { value: amount, validators: ["required", "min:0"] }
    }),
    {
      initCheck: false,
      validateOnChange: false,
      stopAtFirstError: false,
      stopAtFirstFieldError: false
    }
  );

  const handleSubmit = async (v: any) => {
    console.log(`submit: ${v}`);

    if (!postDetailValid()) return;
    
    if (postSubmitHook !== undefined) {
      postSubmitHook();
    }

    let isComplete = false;

    let { txParams, recipientUser } = await createTX()

    open(TxModal, {
      txLink: 'https://explorer.near.org/',
      chain,
      recipientUser,
      txParams,
      isComplete,
    });

    function postDetailValid() {
      return $transactionForm.fields.recipientAccountID.valid && $transactionForm.fields.amount.valid;
    }
  };

  // const handleChange = async (v: any) => {
  //   console.log(`change: ${v}`);
  //   if (postSubmitHook !== undefined) {
  //     postSubmitHook();
  //   }
  // };
  
  function openSendModal(chain: Chain) {
    open(SendModal, {chain});
  }

  const { getChainInfo } = trustWalletAssets;

  async function initBalances(): Promise<
    { chainInfo: ChainInfo; bal: ChainBalance }[]
  > {
    const balanceProms: Promise<ChainBalance>[] = Object.keys($ChainStores).map(
      async (chain: Chain) => {
        const chainInfo = $ChainStores[chain];
        return {
          chain,
          balance: await chainInfo.accounts
            .getGenericMasterAccount()
            .getBalance(),
        } as ChainBalance;
      }
    );

    const balances: ChainBalance[] = await Promise.all(balanceProms);
    return Promise.all(
      balances.map((bal: ChainBalance) => {
        return getChainInfo(bal.chain).then((chainInfo) => {
          return {
            bal,
            chainInfo,
          };
        });
      })
    );
  }

  const balances = initBalances().then(result => {
      return result}
    );
  console.log(balances);

</script>


<!-- svelte-ignore component-name-lowercase -->
<form on:submit|preventDefault={handleSubmit}>
  {#await initBalances() then chains}
    {#each chains as chain, i}
      {#if chain.bal.chain === Chain.NEAR}
      <SendNearFormPart bind:createTX />
      <div>
        {#if $transactionForm.fields.amount.errors.includes('min')}
          <p> Cannot have a negative amount</p>
        {/if}
        {#if $transactionForm.fields.amount.errors.includes('max')}
          <p> Cannot have an amount exceeding balance</p>
        {/if}
        {#if $transactionForm.fields.recipientAccountID.errors.includes('exist')}
          <p> Cannot send to a non-existing account</p>
        {/if}
      </div>
      <div class="flex flex-row justify-around pt-3">
        {#if onCancel !== undefined}
          <Button onClick={onCancel}>Cancel</Button>
        {/if}
        <Button type="submit">Submit</Button>
        <!-- {#if amount < 0}
          <p> Cannot have a negative value</p>
        {:else if amount > Number(chain.bal.balance)}
          <p> Cannot send more than balance</p>
        {:else}
          <Button type="submit">Submit</Button>
        {/if}  -->
      </div>
      {:else}
        Please enter a valid chain through which to send funds
      {/if}
    {/each}
  {:catch error}
    <span
      >An error occurred when attempting to fetch asset data: {error}</span
    >
  {/await}
  
</form>
