<script lang="ts">
  import Card from '../components/base/Card.svelte';
  import Button from '../components/base/Button.svelte';
  import { NearSendTXOpts, NearSigner } from '@baf-wallet/multi-chain';
  import { getNearNetworkId } from '@baf-wallet/interfaces';
  import { KeyStore } from '../state/keys.svelte';
  import { constants } from '../config/constants';
  import { Signer, utils } from 'near-api-js';
  
  export let params = {} as any;
  const optsStr: string = params.opts;
  const opts: NearSendTXOpts= NearSigner.deserializeSendTXOpts(optsStr)

  async function getSigner() {
    let privkey = $KeyStore.privkey;
    let pubkey = $KeyStore.pubkey;
    console.log(privkey, pubkey)
    if (!pubkey || !privkey) {
      throw 'not-logged-in';
    }
    const signer = new NearSigner(
      privkey,
      NearSigner.getImplicitAccountId(pubkey),
      getNearNetworkId(constants.env)
    );
    await signer.awaitConstructorInit();
    console.log(opts)
    return signer;
  }

  async function onApprove(signer: NearSigner) {
    signer.sendTX(opts);
  }
</script>

{#await getSigner()}
  Loading...
{:then signer}
  {#if opts.actions.length !== 1 && opts.actions[0].enum !== 'transfer'}
    Right now BAF-Wallet only support transfering NEAR tokens, please check back
    later for more supported actions.
  {:else}
    <Card>
      Transfering {utils.format.formatNearAmount(
        opts.actions[0].transfer.deposit.toString()
      )}
      <Button onClick = {() => onApprove(signer)}>Approve</Button>
      <Button>Decline</Button>
    </Card>
  {/if}
{:catch e}
  {#if e.toString() === 'not-logged-in'}
    Please login to approve or reject this transaction
  {:else}{/if}
  The following error occured: {e}
{/await}
