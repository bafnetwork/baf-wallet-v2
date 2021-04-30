<script lang="ts">
  import Card from '../components/base/Card.svelte';
  import Button from '../components/base/Button.svelte';
  import AmountFormatter from '../components/base/AmountFormatter.svelte';
  import SuccessIcon from './base/svg/SuccessIcon.svelte';
  import ErrorIcon from './base/svg/ErrorIcon.svelte';
  import Loader from './base/Loader.svelte';

  import { SiteKeyStore } from '../state/keys.svelte';
  import { ChainStores, checkChainInit } from '../state/chains.svelte';
  import { deserializeTxParams } from '@baf-wallet/redirect-generator';
  import {
    Chain,
    GenericTxAction,
    GenericTxParams,
    GenericTxSupportedActions,
  } from '@baf-wallet/interfaces';
  import { getTorusPublicAddress } from '@baf-wallet/torus';
  import { keyPairFromSk } from '@baf-wallet/crypto';
  import BN from 'bn.js';

  export let params = {} as any;
  export let isGenericTx = true;
  export let txInUrl = true;
  export let chain: Chain = params ? params.chain : null;
  export let txParams: GenericTxParams | any;
  export let recipientUser: string;

  let tx: any;
  let actions: GenericTxAction[];
  let isLoading = false;
  let explorerUrl: string;
  let error: string;
  let attemptedApprove = false;
  let txSuccess = false;

  async function initGenericTx() {
    txParams = deserializeTxParams(params.txParams);
    const recipientPubkey = await getTorusPublicAddress(
      txParams.recipientUserId,
      txParams.oauthProvider
    );
    recipientUser = txParams.recipientUserIdReadable;
    const nearTxParams = await $ChainStores[
      Chain.NEAR
    ].tx.buildParamsFromGenericTx(
      txParams,
      recipientPubkey,
      $SiteKeyStore.secpPK,
      $SiteKeyStore.edPK
    );
    actions = txParams.actions;
    tx = await $ChainStores[Chain.NEAR].tx.build(nearTxParams);
  }
  async function initChainSpecificTx() {
    actions = $ChainStores[chain].tx.extractGenericActionsFromTx(txParams);
    tx = await $ChainStores[chain].tx.build(txParams);
  }

  async function init() {
    if (!txInUrl && !txParams) {
      throw new Error("The transaction must be either in the url or passed in through the component's state");
    } else if (!isGenericTx && txInUrl) {
      throw new Error('Unimplemented');
    }
    if (!checkChainInit($ChainStores, chain)) {
      throw new Error('You must be logged in to send a tx');
    }
    if (isGenericTx) {
      await initGenericTx();
    } else {
      await initChainSpecificTx();
    }
  }

  async function onApprove() {
    attemptedApprove = true;
    isLoading = true;
    try {
      const signed = await $ChainStores[Chain.NEAR].tx.sign(
        tx,
        keyPairFromSk($SiteKeyStore.edSK)
      );
      BN.prototype.toString = undefined;
      const ret = await $ChainStores[Chain.NEAR].tx.send(signed);
      explorerUrl = ret.snd;
      txSuccess = true;
    } catch (e) {
      error = e;
    }
    isLoading = false;
  }
</script>

{#await init()}
  Loading...
{:then signer}
  {#if !txSuccess}
    <Card>
      {#each actions as action, i}
        {#if action.type === GenericTxSupportedActions.TRANSFER}
          <p>
            Action #{i + 1}: Transfering <AmountFormatter
              bal={{ chain, balance: action.amount }}
            />
            to {recipientUser}
          </p>
        {:else}
          An error occured, an unsupported action type was passed in!
        {/if}
      {/each}
      <Button onClick={() => (!isLoading ? onApprove() : null)}>Approve</Button>
      <Button>Decline</Button>
    </Card>
  {/if}
{:catch e}
  {#if e.toString() === 'not-logged-in'}
    Please login to approve or reject this transactiocofoundingn
  {:else}
    The following error occured: {e && console.error(e)}
  {/if}
{/await}
<div>
  {#if attemptedApprove}
    {#if isLoading}
      <p>Beep bop beep boop, trying to send your transaction</p>
      <Loader />
    {:else if error}
      <ErrorIcon />
    {:else}
      <p>Success!</p>
      <SuccessIcon />
      <span class="text-center"
        >Explorer: <a
          target="_blank"
          rel="noopener noreferrer"
          href={explorerUrl}>{explorerUrl}</a
        ></span
      >
    {/if}
  {/if}
</div>
