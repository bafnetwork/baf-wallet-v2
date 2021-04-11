<!-- TODO: have it so that the pubkey can be intialized correctly -->
<script lang="ts">
  import Card from '../components/base/Card.svelte';
  import Button from '../components/base/Button.svelte';
  import {
    NearAccountSingelton,
    NearSendTXOpts,
    NearSigner,
  } from '@baf-wallet/multi-chain';
  import { CryptoCurves, getNearNetworkId } from '@baf-wallet/interfaces';
  import { KeyStore } from '../state/keys.svelte';
  import { constants } from '../config/constants';
  import { utils } from 'near-api-js';
  import { curve } from 'elliptic';

  export let params = {} as any;
  const optsStr: string = params.opts;
  const opts: NearSendTXOpts = NearSigner.deserializeSendTXOpts(optsStr);

  async function getSigner() {
    let privkey = $KeyStore.secret;
    let pubkey = $KeyStore.ed25519Pubkey;
    console.log(privkey, pubkey);
    if (!pubkey || !privkey) {
      throw 'not-logged-in';
    }
    const networkId = getNearNetworkId(constants.env);
    const signer = new NearSigner(
      privkey,
      NearAccountSingelton.getAccountNameFromPubkey(
        $KeyStore.secp256k1Pubkey,
        CryptoCurves.secp256k1,
        networkId
      ),
      networkId
    );
    await signer.awaitConstructorInit();
    console.log(opts);
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
      <Button onClick={() => onApprove(signer)}>Approve</Button>
      <Button>Decline</Button>
    </Card>
  {/if}
{:catch e}
  {#if e.toString() === 'not-logged-in'}
    Please login to approve or reject this transaction
  {:else}{/if}
  The following error occured: {console.error(e) || ""}
{/await}
