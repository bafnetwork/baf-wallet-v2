<script lang="ts">
  // import Card from '../components/base/Card.svelte';
  // import { KeyStore } from '../state/keys.svelte';
  import { createSigner } from './ApproveRedirectHlpr';
  // import { constants } from '../config/constants';
  // import { utils } from 'near-api-js';

  // export let params = {} as any;
  // const optsStr: string = params.opts;
  let privkey = ""//$KeyStore.privkey
  let pubkey = ""//$KeyStore.pubkey
  let signer = createSigner(privkey, pubkey);
  let signerProm = signer.awaitConstructorInit()

  // async function onApprove() {
  //   signer.sendTX(opts);
  // }
</script>

{#await signerProm}
  Loading...
{:then x}
  {x}
  <!-- {#if opts.actions.length !== 1 && opts.actions[0].enum !== 'transfer'}
    Right now BAF-Wallet only support transfering NEAR tokens, please check back
    later for more supported actions.
  {:else}
    <Card>
      Transfering {utils.format.formatNearAmount(
        opts.actions[0].transfer.deposit.toString()
      )}
    </Card>
  {/if} -->
  Result!!
{:catch e}
  The following error occured: {e}
{/await}
