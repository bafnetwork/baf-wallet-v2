<script lang="ts">
  import Card from '../components/base/Card.svelte';
  import type { NearSendTXOpts } from '@baf-wallet/multi-chain';
  import { NearSigner } from '@baf-wallet/multi-chain';
  import { KeyStore } from '../state/keys.svelte';
  import { getNearNetworkId } from '@baf-wallet/interfaces';
  // import { constants } from '../config/constants';
  import { utils } from 'near-api-js';

  export let params = {} as any;
  const optsStr: string = params.opts;
  const opts: NearSendTXOpts = NearSigner.deserializeSendTXOpts(optsStr);
  const signer = new NearSigner(
    $KeyStore.privkey,
    NearSigner.getImplicitAccountId($KeyStore.pubkey),
    getNearNetworkId(0)
  );

  // async function onApprove() {
  //   signer.sendTX(opts);
  // }
</script>

{#await signer.awaitConstructorInit()}
  Loading...
{:then}
  {#if opts.actions.length !== 1 && opts.actions[0].enum !== 'transfer'}
    Right now BAF-Wallet only support transfering NEAR tokens, please check back
    later for more supported actions.
  {:else}
    <Card>
      Transfering {utils.format.formatNearAmount(
        opts.actions[0].transfer.deposit.toString()
      )}
    </Card>
  {/if}
  Result!!
{:catch e}
  The following error occured: {e}
{/await}
