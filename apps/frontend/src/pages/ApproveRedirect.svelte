<script lang="ts">
  import Button from "../components/base/Button.svelte";
  import Layout from "../components/Layout.svelte";
  import Card from "../components/base/Card.svelte";
  export let params = {} as any
  // TODO: use EIP-712: https://github.com/Mrtenz/eip-712/tree/master/src if it's JSON, or expect a hash
  // const txStr = '{ "to": "0x420", "amount": 69, "data": { "msg": "BAF token when" }}';
  // const tx = JSON.parse(txStr);
  const nonce = params.nonce
  const appName = "BAF DAO";
  // import Card from '../components/base/Card.svelte';
  // import { KeyStore } from '../state/keys.svelte';
  import { createSigner } from './ApproveRedirectHlpr';
  // import { constants } from '../config/constants';
  // import { utils } from 'near-api-js';

  const optsStr: string = decodeURIComponent(params.opts);
  const opts = JSON.parse(optsStr);
  let privkey = ""//$KeyStore.privkey
  let pubkey = ""//$KeyStore.pubkey
  let signer = createSigner(privkey, pubkey);
  let signerProm = signer.awaitConstructorInit()
  const data = opts.actions;
  const recipient = opts.receiverAccountId;

  // async function onApprove() {
  //   signer.sendTX(opts);
  // }
</script>

{#await signerProm}
  Loading...
{:then x}
  {x}
  <Layout>
    <Card classExtra="flex flex-col divide">
      <h1 class="pb-2 text-xl text-center">{appName} would like to execute a transaction</h1>
      <div class="flex flex-row justify-center">
        <span class="mx-2">To: {recipient}</span>
      </div>
      {#if data}
        <span class="mx-2 text-center">Data</span>
        <div class="flex flex-row justify-center">
          <code>
            {JSON.stringify(data, null, 2)}
          </code>
        </div>
      {/if}
      <div class="flex flex-row justify-center">
        <Button classExtra="mx-2">Approve</Button>
        <Button classExtra="mx-2">Cancel</Button>
      </div>
    </Card>
  </Layout>
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
  <!-- Result!! -->
{:catch e}
  The following error occured: {e}
{/await}


