<!-- TODO: have it so that the pubkey can be intialized correctly -->
<script lang="ts">
  import Card from '../components/base/Card.svelte';
  import Button from '../components/base/Button.svelte';
  // import {
  //   NearAccount,
  //   NearSendTXOpts,
  //   NearSigner,
  // } from '@baf-wallet/multi-chain';
  // import {
  //   CryptoCurves,
  //   getNearNetworkId,
  //   NearSupportedActionTypes,
  //   NearTransferParam,
  // } from '@baf-wallet/interfaces';
  import { SiteKeyStore } from '../state/keys.svelte';
  import { constants } from '../config/constants';
  import { utils } from 'near-api-js';
  import { getBafContract } from '@baf-wallet/baf-contract';
  
  export let params = {} as any;
  let transferAmount: string;
  const optsStr: string = params.opts;
  const opts: NearSendTXOpts = NearSigner.deserializeSendTXOpts(optsStr);

  async function init() {
    let edSK = $SiteKeyStore.edSK;
    let edPK = $SiteKeyStore.edPK;
    if (!edPK || !edSK) {
      throw 'not-logged-in';
    }
    const networkId = getNearNetworkId(constants.env);
    const signer = new NearSigner(
      edSK,
      // TODO:!!
      await getBafContract().getAccountId($SiteKeyStore.secpPK),
      networkId
    );
    // TODO: frontend error handling for params
    transferAmount = (opts.actions[0].params as NearTransferParam).amount;
    await signer.awaitConstructorInit();
    return signer;
  }

  async function onApprove(signer: NearSigner) {
    const tx = await signer.createTX(opts);
    const enc = await signer.signTX(tx);
    const explorerUrl = await signer.sendTX(enc);
    alert(`See the result at: ${explorerUrl}`);
  }
</script>

{#await init()}
  Loading...
{:then signer}
  {#if opts.actions.length !== 1 && opts.actions[0].type !== NearSupportedActionTypes.TRANSFER}
    Right now BAF-Wallet only support transfering NEAR tokens, please check back
    later for more supported actions.
  {:else}
    <Card>
      Transfering {utils.format.formatNearAmount(transferAmount)} to {opts.receiverAccountId}
      <Button onClick={() => onApprove(signer)}>Approve</Button>
      <Button>Decline</Button>
    </Card>
  {/if}
{:catch e}
  {#if e.toString() === 'not-logged-in'}
    Please login to approve or reject this transaction
  {:else}
    The following error occured: {e}
  {/if}
{/await}
