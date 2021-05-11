<script lang="ts">
  import { getContext } from 'svelte';

  import {
    ChainBalance,
    SupportedTransferTypes,
    TokenInfo,
  } from '@baf-wallet/interfaces';
  import { getTokenInfo } from '@baf-wallet/trust-wallet-assets';
  import { Content, Actions } from '@smui/card';
  import Button, { Label } from '@smui/button';
  import SendModal from './SendModal.svelte';
  import { Chain, CreateTxReturn } from '@baf-wallet/interfaces';
  import Lazy from '@baf-wallet/svelte-lib/base-components/Lazy.svelte';
  import TxModal from './TxModal.svelte';
  import { ChainStores } from '../state/chains.svelte';
  import { SiteKeyStore } from '../state/keys.svelte';
  import { BafError } from '@baf-wallet/errors';
  import { buildSendFormRules, checkForm } from '@baf-wallet/svelte-lib/forms';

  let createTX: <T>() => Promise<CreateTxReturn<T>>;
  export let postSubmitHook: () => void | undefined;
  export let chain: Chain;
  export let transferType: SupportedTransferTypes;
  export let tokenInfo: TokenInfo;

  // Only a required parameter if the transfer type is for a contract token
  export let contractAddress: string;

  let chainSendFormPart;
  const { open } = getContext('modal');
  let amount: number = 0;
  let recipientAccountID: string = '';

  // const transactionForm = svelteForms(
  //   () => ({
  //     recipientAccountID: {
  //       value: recipientAccountID,
  //       validators: ['required'],
  //     },
  //     amount: { value: amount, validators: ['required', 'min:0'] },
  //   }),
  //   {
  //     initCheck: false,
  //     validateOnChange: false,
  //     stopAtFirstError: false,
  //     stopAtFirstFieldError: false,
  //   }
  // );

  if (
    transferType === SupportedTransferTypes.ContractToken &&
    !contractAddress
  ) {
    throw BafError.MissingContractAddress();
  }

  // TODO: clean up imports, see https://github.com/bafnetwork/baf-wallet-v2/issues/54
  const ChainSendFormPart = (chain: Chain) => () =>
    import(`../../../../libs/${chain}/src/web/SendFormPart.svelte`);

  export const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const formRet = await checkForm(
      tokenInfo,
      $ChainStores[chain],
      buildSendFormRules($ChainStores[chain]),
      {
        recipientAddress: chainSendFormPart.recipientAccountID,
        amount: chainSendFormPart.amountFormatted,
      }
    );
    console.log(formRet);
    // if (!postDetailValid()) return;
    console.log(chainSendFormPart);
    createTX = chainSendFormPart.createTX;
    if (postSubmitHook !== undefined) {
      postSubmitHook();
    }

    let isComplete = false;

    const { txParams, recipientUser } = await createTX();
    open(TxModal, {
      tokenInfo,
      chain,
      recipientUser,
      txParams,
      isComplete,
    });

    // function postDetailValid() {
    //   return (
    //     $transactionForm.fields.recipientAccountID.valid &&
    //     $transactionForm.fields.amount.valid
    //   );
    // }
  };

  async function initBalances(): Promise<
    { chainInfo: TokenInfo; bal: ChainBalance }[]
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
        return getTokenInfo(bal.chain).then((chainInfo) => {
          return {
            bal,
            chainInfo,
          };
        });
      })
    );
  }

  const balances = initBalances().then((result) => {
    return result;
  });
  console.log(balances);
</script>

<!-- 
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
        {#if amount < 0}
          <p> Cannot have a negative value</p>
        {:else if amount > Number(chain.bal.balance)}
          <p> Cannot send more than balance</p>
        {:else}
          <Button type="submit">Submit</Button>
        {/if}
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
  
</form> -->

<form on:submit={handleSubmit}>
  <Content>
    <h1>Send {tokenInfo.name}</h1>
    {#if transferType === SupportedTransferTypes.NativeToken}
      <Lazy
        component={ChainSendFormPart(chain)}
        chainInterface={$ChainStores[chain]}
        edPK={$SiteKeyStore.edPK}
        secpPK={$SiteKeyStore.secpPK}
        {tokenInfo}
        bind:selfBind={chainSendFormPart}
      />
    {:else if transferType === SupportedTransferTypes.ContractToken}
      <Lazy
        component={ChainSendFormPart(chain)}
        chainInterface={$ChainStores[chain]}
        edPK={$SiteKeyStore.edPK}
        secpPK={$SiteKeyStore.secpPK}
        isContractToken={true}
        {tokenInfo}
        {contractAddress}
        bind:selfBind={chainSendFormPart}
      /><!-- else if content here -->
    {:else}
      Transfering {transferType} is unsupported
    {/if}
  </Content>
  <Actions>
    <Button type="submit" variant="raised">
      <Label>Send!</Label>
    </Button>
    <Button on:click={close}>
      <Label>Cancel</Label>
    </Button>
  </Actions>
</form>
