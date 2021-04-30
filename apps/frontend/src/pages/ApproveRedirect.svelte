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
  let tx: any;
  let recipientUser: string;
  const chain: Chain = params.chain;
  let txParams: GenericTxParams;

  async function init() {
    txParams = deserializeTxParams(params.txParams);
    const recipientPubkey = await getTorusPublicAddress(
      txParams.recipientUserId,
      txParams.oauthProvider
    );
    if (!checkChainInit($ChainStores, chain))
      throw 'You must be logged in to send a tx';
    recipientUser = txParams.recipientUserIdReadable;
    const nearTxParams = await $ChainStores[
      Chain.NEAR
    ].tx.buildParamsFromGenericTx(
      txParams,
      recipientPubkey,
      $SiteKeyStore.secpPK,
      $SiteKeyStore.edPK
    );
    tx = await $ChainStores[Chain.NEAR].tx.build(nearTxParams);
  }

  async function onApprove() {
    const signed = await $ChainStores[Chain.NEAR].tx.sign(
      tx,
      keyPairFromSk($SiteKeyStore.edSK)
    );
    BN.prototype.toString = undefined;
    const ret = await $ChainStores[Chain.NEAR].tx.send(signed);
    const explorerUrl = ret.snd;
    alert(`See the result at: ${explorerUrl}`);
  }
</script>

{#await init()}
  Loading...
{:then signer}
  <Card>
    {#each txParams.actions as action, i}
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
