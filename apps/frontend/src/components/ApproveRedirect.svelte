<script lang="ts">
  import Card from '@baf-wallet/base-components/Card.svelte';
  import Button from '@baf-wallet/base-components/Button.svelte';
  import AmountFormatter from '@baf-wallet/base-components/AmountFormatter.svelte';
  import SuccessIcon from '@baf-wallet/base-components/svg/SuccessIcon.svelte';
  import ErrorIcon from '@baf-wallet/base-components/svg/ErrorIcon.svelte';
  import { BafError } from '@baf-wallet/errors';
  import Spinner from 'svelte-spinner';

  //TODO: Change to global color vairable. See https://github.com/bafnetwork/baf-wallet-v2/issues/53
  let size = 25;
  let speed = 750;
  let color = '#A82124';
  let thickness = 2.0;
  let gap = 40;

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
    if (
      !txParams.recipientUserId ||
      !txParams.oauthProvider ||
      !txParams.recipientUserIdReadable
    ) {
      throw BafError.GenericTxRequiresOauthInfo();
    }
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
      throw BafError.InvalidTransactionApproveRedirect();
    } else if (!isGenericTx && txInUrl) {
      throw BafError.Unimplemented();
    }
    if (!checkChainInit($ChainStores, chain)) {
      throw BafError.UninitChain(chain);
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
    <Card styleType="primary">
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
      <Button
        styleType="secondary"
        onClick={() => (!isLoading ? onApprove() : null)}>Approve</Button
      >
      <Button styleType="danger">Decline</Button>
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
      <Spinner {size} {speed} {color} {thickness} {gap} />
    {:else if error}
      <ErrorIcon />
    {:else}
      <p>Success!</p>
      <SuccessIcon />
      <span
        >Explorer: <a
          target="_blank"
          rel="noopener noreferrer"
          href={explorerUrl}>{explorerUrl}</a
        ></span
      >
    {/if}
  {/if}
</div>
