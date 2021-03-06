<script lang="ts">
  import Card, { Content, ActionButton, Actions } from '@smui/card';
  import Button from '@smui/button';
  import { Icon} from '@smui/common';
  import AmountFormatter from '@baf-wallet/base-components/AmountFormatter.svelte';
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
  import { getTokenInfo, TokenInfo } from '@baf-wallet/chain-info';

  export let params = {} as any;
  export let isGenericTx = true;
  export let txInUrl = true;
  export let chain: Chain = params ? params.chain : null;
  export let txParams: GenericTxParams | any;
  export let recipientUser: string;
  export let tokenInfo: TokenInfo;
  export let onCancel = () => window.close();

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
    } else if (txInUrl) {
      tokenInfo = await getTokenInfo(chain);
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
    <Card padded>
      <Content>
        <h3>Looks like you are trying to...</h3>
        {#each actions as action, i}
          {#if action.type === GenericTxSupportedActions.TRANSFER}
            <p>
              transfer <AmountFormatter
                bal={action.amount}
                {chain}
                {tokenInfo}
              />
              to {recipientUser}
            </p>
          {:else if action.type === GenericTxSupportedActions.TRANSFER_CONTRACT_TOKEN}
            <p>
              transfer <AmountFormatter
                bal={action.amount}
                {chain}
                isNativeToken={false}
                {tokenInfo}
              /> to {recipientUser} for contract
              {action.contractAddress}
            </p>
          {:else}
            An error occured, an unsupported action type was passed in!
          {/if}
        {/each}
      </Content>
      <Actions>
        <Button
          variant="raised"
          on:click={() => (!isLoading ? onApprove() : null)}>Approve</Button
        >
        <!-- TODO action -->
        <Button styleType="danger" on:click={onCancel}>Decline</Button>
      </Actions>
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
      <Icon class="material-icons">error</Icon>
    {:else}
      <p>Success!</p>
      <Icon class="material-icons">check</Icon>
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
