<script lang="ts">
  import { getContext } from 'svelte';
  import { Chain, CreateTxReturn } from '@baf-wallet/interfaces';
  import Button from '@baf-wallet/base-components/Button.svelte';
  import Lazy from '@baf-wallet/base-components/Lazy.svelte';
  import TxModal from './TxModal.svelte';
  import { ChainStores } from '../state/chains.svelte';
  import { SiteKeyStore } from '../state/keys.svelte';

  let createTX: <T>() => Promise<CreateTxReturn<T>>;
  export let postSubmitHook: () => void | undefined;
  export let onCancel: () => void | undefined;
  export let chain: Chain;

  let chainSendFormPart;
  const { open } = getContext('modal');

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
      txLink: 'https://explorer.near.org/',
      chain,
      recipientUser,
      txParams,
      isComplete,
      error,
    });
  };
</script>

<form on:submit={handleSubmit}>
  <!-- TODO: bind createTX somehow!! -->
  <Lazy
    component={ChainSendFormPart(chain)}
    chainInterface={$ChainStores[chain]}
    edPK={$SiteKeyStore.edPK}
    secpPK={$SiteKeyStore.secpPK}
    bind:selfBind={chainSendFormPart}
  />
  <!-- <SendNearFormPart bind:createTX /> -->
  <div class="flex flex-row justify-around pt-3">
    {#if onCancel !== undefined}
      <Button onClick={onCancel} styleType="danger">Cancel</Button>
    {/if}
    <Button type="submit">Submit</Button>
  </div>
</form>
