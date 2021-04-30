<!-- TODO: have it so that the pubkey can be intialized correctly -->
<script lang="ts">
  import Card from '../components/base/Card.svelte';
  import Button from '../components/base/Button.svelte';
  import AmountFormatter from '../components/base/AmountFormatter.svelte';
  import { SiteKeyStore } from '../state/keys.svelte';
  import { utils as nearUtils } from 'near-api-js';
  import { ChainStores, checkChainInit } from '../state/chains.svelte';
  import { deserializeTxParams } from '@baf-wallet/redirect-generator';
  import {
    Chain,
    Encoding,
    GenericTxParams,
    GenericTxSupportedActions,
  } from '@baf-wallet/interfaces';
  import { getTorusPublicAddress } from '@baf-wallet/torus';
  import { keyPairFromSk } from '@baf-wallet/multi-chain';
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
      throw "The transaction must be either in the url or passed in through the component's state";
    } else if (!isGenericTx && txInUrl) {
      throw 'Unimplemented';
    }
    if (!checkChainInit($ChainStores, chain)) {
      throw 'You must be logged in to send a tx';
    }
    if (isGenericTx) {
      await initGeneriTx();
    } else {
      await initChainSpecificTx();
    }
  }

  async function onApprove() {
    attemptedApprove = true
    isLoading = true;
    try {
      const signed = await $ChainStores[Chain.NEAR].tx.sign(
        tx,
        keyPairFromSk($SiteKeyStore.edSK)
      );
      BN.prototype.toString = undefined;
      const ret = await $ChainStores[Chain.NEAR].tx.send(signed);
      explorerUrl = ret.snd;
    } catch (e) {
      error = e;
    }
    isLoading = false;
  }
</script>

{#await init()}
  Loading...
{:then signer}
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
    <Button onClick={() => onApprove()}>Approve</Button>
    <Button>Decline</Button>
  </Card>
  <!-- {/if} -->
{:catch e}
  {#if e.toString() === 'not-logged-in'}
    Please login to approve or reject this transactiocofoundingn
  {:else}
    The following error occured: {e && console.error(e)}
  {/if}
{/await}
<!-- TODO: factor out -->
<div class="flex flex-row justify-center py-4">
  {#if attemptedApprove}
    {#if isLoading}
      <svg
        width="105"
        height="105"
        viewBox="0 0 105 105"
        xmlns="http://www.w3.org/2000/svg"
        class="fill-current text-lightBlue-900"
      >
        <circle cx="12.5" cy="12.5" r="12.5">
          <animate
            attributeName="fill-opacity"
            begin="0s"
            dur="1s"
            values="1;.2;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="12.5" cy="52.5" r="12.5" fill-opacity=".5">
          <animate
            attributeName="fill-opacity"
            begin="100ms"
            dur="1s"
            values="1;.2;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="52.5" cy="12.5" r="12.5">
          <animate
            attributeName="fill-opacity"
            begin="300ms"
            dur="1s"
            values="1;.2;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="52.5" cy="52.5" r="12.5">
          <animate
            attributeName="fill-opacity"
            begin="600ms"
            dur="1s"
            values="1;.2;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="92.5" cy="12.5" r="12.5">
          <animate
            attributeName="fill-opacity"
            begin="800ms"
            dur="1s"
            values="1;.2;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="92.5" cy="52.5" r="12.5">
          <animate
            attributeName="fill-opacity"
            begin="400ms"
            dur="1s"
            values="1;.2;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="12.5" cy="92.5" r="12.5">
          <animate
            attributeName="fill-opacity"
            begin="700ms"
            dur="1s"
            values="1;.2;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="52.5" cy="92.5" r="12.5">
          <animate
            attributeName="fill-opacity"
            begin="500ms"
            dur="1s"
            values="1;.2;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="92.5" cy="92.5" r="12.5">
          <animate
            attributeName="fill-opacity"
            begin="200ms"
            dur="1s"
            values="1;.2;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    {:else if error}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd"
        />
      </svg>
    {:else}
      <p>Success!</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 13l4 4L19 7"
        />
      </svg>
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
