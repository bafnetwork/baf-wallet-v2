<script lang="ts">
  import { getContext } from 'svelte';
  import {
    Chain,
    CreateTxReturn,
    GenericTxAction,
    SupportedTransferTypes,
  } from '@baf-wallet/interfaces';
  import Button from '@baf-wallet/base-components/Button.svelte';
  import Lazy from '@baf-wallet/base-components/Lazy.svelte';
  import TxModal from './TxModal.svelte';
  import { ChainStores } from '../state/chains.svelte';
  import { SiteKeyStore } from '../state/keys.svelte';
  import { BafError } from '@baf-wallet/errors';
  import { TokenInfo } from '@baf-wallet/trust-wallet-assets';

  let createTX: <T>() => Promise<CreateTxReturn<T>>;
  export let postSubmitHook: () => void | undefined;
  export let onCancel: () => void | undefined;
  export let chain: Chain;
  export let transferType: SupportedTransferTypes;
  export let tokenInfo: TokenInfo;

  // Only a required parameter if the transfer type is for a contract token
  export let contractAddress: string;
  let tokenName: string = tokenInfo.name;
  let decimals: number = tokenInfo.decimals;

  let chainSendFormPart;
  const { open } = getContext('modal');

  if (
    transferType === SupportedTransferTypes.ContractToken &&
    !contractAddress
  ) {
    throw BafError.MissingContractAddress();
  }

  // TODO: clean up imports, see https://github.com/bafnetwork/baf-wallet-v2/issues/54
  const ChainSendFormPart = (chain: Chain) => () =>
    import(`../../../../libs/${chain}/src/web/SendFormPart.svelte`);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    console.log(chainSendFormPart);
    createTX = chainSendFormPart.createTX;
    if (postSubmitHook !== undefined) {
      postSubmitHook();
    }

    let isComplete = false;
    let error;

    const { txParams, recipientUser } = await createTX();
    open(TxModal, {
      tokenInfo,
      chain,
      recipientUser,
      txParams,
      isComplete,
      error,
    });
  };
</script>

<form on:submit={handleSubmit}>
  {#if transferType === SupportedTransferTypes.NativeToken}
    <Lazy
      component={ChainSendFormPart(chain)}
      chainInterface={$ChainStores[chain]}
      edPK={$SiteKeyStore.edPK}
      secpPK={$SiteKeyStore.secpPK}
      {tokenName}
      bind:selfBind={chainSendFormPart}
    />
  {:else if transferType === SupportedTransferTypes.ContractToken}
    <Lazy
      component={ChainSendFormPart(chain)}
      chainInterface={$ChainStores[chain]}
      edPK={$SiteKeyStore.edPK}
      secpPK={$SiteKeyStore.secpPK}
      isContractToken={true}
      {tokenName}
      {contractAddress}
      {decimals}
      bind:selfBind={chainSendFormPart}
    /><!-- else if content here -->
  {:else}
    Transfering {transferType} is unsupported
  {/if}
  <div class="">
    {#if onCancel !== undefined}
      <Button onClick={onCancel} styleType="danger">Cancel</Button>
    {/if}
    <Button type="submit">Submit</Button>
  </div>
</form>
