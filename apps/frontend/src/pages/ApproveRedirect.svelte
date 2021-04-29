<!-- TODO: have it so that the pubkey can be intialized correctly -->
<script lang="ts">
  import Card from '../components/base/Card.svelte';
  import Button from '../components/base/Button.svelte';
  import { SiteKeyStore } from '../state/keys.svelte';
  import { utils } from 'near-api-js';
  import { getBafContract } from '@baf-wallet/baf-contract';
  import { ChainStores, checkChainInit } from '../state/chains.svelte';
  import {
    convertTxAction,
    deserializeTxParams,
    TransferParams,
  } from '@baf-wallet/redirect-generator';
  import { Chain, Encoding } from '@baf-wallet/interfaces';
  import { getTorusPublicAddress } from '@baf-wallet/torus';
  import { keyPairFromSk } from '@baf-wallet/multi-chain';
  import { NearSupportedActionTypes } from '@baf-wallet/near';
import { apiClient } from '../config/api';
import BN from 'bn.js';

  export let params = {} as any;
  let transferAmount: string;
  let recipientAccountID: string;
  let tx: any;
  const actionStr: string = params.action;
  const chain: Chain = params.chain;
  // const opts: NearSendTXOpts = NearSigner.deserializeSendTXOpts(optsStr);

  async function init() {
    const action = convertTxAction(actionStr);
    switch (action.toString()) {
      case 'transfer':
        const txParams = deserializeTxParams<TransferParams>(params.txParams);
        console.log(txParams, chain);
        const recipientPubkey = await getTorusPublicAddress(
          txParams.recipientUserId,
          txParams.oauthProvider
        );
        console.log(recipientPubkey.format(Encoding.HEX))
        switch (chain) {
          case Chain.NEAR:
            // TODO: error handling
            if (!checkChainInit($ChainStores, Chain.NEAR))
              throw 'You must be logged in to send a tx';
            recipientAccountID = await getBafContract().getAccountId(
              recipientPubkey
            );
            transferAmount = txParams.amount;
            tx = await $ChainStores[Chain.NEAR].tx.build({
              actions: [
                {
                  type: NearSupportedActionTypes.TRANSFER,
                  params: {
                    amount: txParams.amount as string,
                    discriminator: NearSupportedActionTypes.TRANSFER,
                  },
                },
              ],
              senderPk: $SiteKeyStore.edPK,
              senderAccountID: $ChainStores[Chain.NEAR].getInner()
                .nearMasterAccount.accountId,
              recipientAccountID,
            });
            break;
          default:
            throw 'unsupported chain';
        }
        break;
      default:
        throw 'unsupported action';
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
    console.log(signed)
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
    Transfering {utils.format.formatNearAmount(transferAmount)} to {recipientAccountID}
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
