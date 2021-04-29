<!-- TODO: have it so that the pubkey can be intialized correctly -->
<script lang="ts">
  import Card from '../components/base/Card.svelte';
  import Button from '../components/base/Button.svelte';
  import { SiteKeyStore } from '../state/keys.svelte';
  import { utils } from 'near-api-js';
  import { getBafContract } from '@baf-wallet/baf-contract';
  import { ChainStores, checkChainInit } from '../state/chains.svelte';
  import { deserializeTxParams } from '@baf-wallet/redirect-generator';
  import { Chain, Encoding } from '@baf-wallet/interfaces';
  import { getTorusPublicAddress } from '@baf-wallet/torus';
  import { keyPairFromSk } from '@baf-wallet/multi-chain';
  import BN from 'bn.js';

  export let params = {} as any;
  let transferAmount: string;
  let tx: any;
  const chain: Chain = params.chain;

  async function init() {
    const txParams = deserializeTxParams(params.txParams);
    const recipientPubkey = await getTorusPublicAddress(
      txParams.recipientUserId,
      txParams.oauthProvider
    );
    switch (chain) {
      case Chain.NEAR:
        if (!checkChainInit($ChainStores, Chain.NEAR))
          throw 'You must be logged in to send a tx';
        const nearTxParams = await $ChainStores[Chain.NEAR].tx.buildParamsFromGenericTx(
          txParams,
          recipientPubkey,
          $SiteKeyStore.edPK
        );
        tx = await $ChainStores[Chain.NEAR].tx.build(nearTxParams)
        return;
      default:
        throw 'unsupported chain';
    }
    // const { chain, params } = deserializeTxParams;
    // const $ChainStores;
    // const networkId = getNearNetworkId(constants.env);
    // const signer = new NearSigner(
    //   edSK,
    //   // TODO:!!
    //   await getBafContract().getAccountId($SiteKeyStore.secpPK),
    //   networkId
    // );
    // // TODO: frontend error handling for params
    // transferAmount = (opts.actions[0].params as NearTransferParam).amount;
    // await signer.awaitConstructorInit();
    // return signer;
  }

  async function onApprove() {
    const signed = await $ChainStores[Chain.NEAR].tx.sign(
      tx,
      keyPairFromSk($SiteKeyStore.edSK)
    );
    BN.prototype.toString = undefined;
    console.log(signed);
    const ret = await $ChainStores[Chain.NEAR].tx.send(signed);
    const explorerUrl = ret.snd;
    // const tx = await signer.createTX(opts);
    // const enc = await signer.signTX(tx);
    // const explorerUrl = await signer.sendTX(enc);
    alert(`See the result at: ${explorerUrl}`);
  }
</script>

{#await init()}
  Loading...
{:then signer}
  <!-- {#if opts.actions.length !== 1 && opts.actions[0].type !== NearSupportedActionTypes.TRANSFER} -->
  Right now BAF-Wallet only support transfering NEAR tokens, please check back later
  for more supported actions.
  <!-- {:else} -->
  <Card>
    Transfering {utils.format.formatNearAmount(transferAmount)} to "AAAA"
    <Button onClick={() => onApprove()}>Approve</Button>
    <Button>Decline</Button>
  </Card>
  <!-- {/if} -->
{:catch e}
  {#if e.toString() === 'not-logged-in'}
    Please login to approve or reject this transactiocofoundingn
  {:else}
    The following error occured: {console.error(e)}
  {/if}
{/await}
