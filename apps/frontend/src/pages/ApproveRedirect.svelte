<!-- TODO: have it so that the pubkey can be intialized correctly -->
<script lang="ts">
  import Card from '../components/base/Card.svelte';
  import Button from '../components/base/Button.svelte';
  import { SiteKeyStore } from '../state/keys.svelte';
  import { utils as nearUtils } from 'near-api-js';
  import { ChainStores, checkChainInit } from '../state/chains.svelte';
  import { deserializeTxParams } from '@baf-wallet/redirect-generator';
  import { Chain, Encoding } from '@baf-wallet/interfaces';
  import { getTorusPublicAddress } from '@baf-wallet/torus';
  import { keyPairFromSk } from '@baf-wallet/multi-chain';
  import BN from 'bn.js';

  export let params = {} as any;
  let transferAmount: string;
  let tx: any;
  let recipientUser: string;
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
        // TODO: seperate out
        transferAmount = txParams.actions[0].amount
        recipientUser = txParams.recipientUserIdReadable
        const nearTxParams = await $ChainStores[
          Chain.NEAR
        ].tx.buildParamsFromGenericTx(
          txParams,
          recipientPubkey,
          $SiteKeyStore.edPK
        );
        tx = await $ChainStores[Chain.NEAR].tx.build(nearTxParams);
        return;
      default:
        throw 'unsupported chain';
    }
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
    alert(`See the result at: ${explorerUrl}`);
  }
</script>

{#await init()}
  Loading...
{:then signer}
  <!-- {#if opts.actions.length !== 1 && opts.actions[0].type !== NearSupportedActionTypes.TRANSFER} -->
  <!-- TODO: there is gonna have to be some card to show the diff types of transactions -->
  Right now BAF-Wallet only support transfering NEAR tokens, please check back later
  for more supported actions.
  <!-- {:else} -->
  <Card>
    Transfering {nearUtils.format.formatNearAmount(transferAmount)} to {recipientUser}
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
