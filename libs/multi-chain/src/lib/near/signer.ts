import { Signer } from '../interfaces/base-classes';
import {
  KeyPair,
  keyStores,
  providers,
  transactions,
  utils,
} from 'near-api-js';
import { Chain } from '@baf-wallet/interfaces';
import type { NearNetworkId } from '@baf-wallet/interfaces';
import { sha256 } from 'js-sha256';
import { Buffer } from 'buffer';

export interface NearSendTXOpts {
  actions: transactions.Action[];
  receiverAccountId: string;
}

export class NearSigner extends Signer<NearSendTXOpts> {
  private keyStore: keyStores.InMemoryKeyStore;
  private initProm: Promise<void>;
  private provider: providers.JsonRpcProvider;

  constructor(
    privKey: string,
    private accountId: string,
    private networkId: NearNetworkId
  ) {
    super(Chain.NEAR);
    this.keyStore = new keyStores.InMemoryKeyStore();
    const keyPair = KeyPair.fromString(privKey);
    this.initProm = this.keyStore.setKey(
      this.networkId,
      this.accountId,
      keyPair
    );
    this.provider = new providers.JsonRpcProvider(
      `https://rpc.${networkId}.near.org`
    );
  }

  public async awaitConstructorInit() {
    return this.initProm;
  }

  public async sendTX(opts: NearSendTXOpts) {
    const keyPair = await this.keyStore.getKey(this.networkId, this.accountId);
    const pubkey = keyPair.getPublicKey();
    console.log(this.accountId, pubkey.toString());
    const accessKey = await this.provider.query(
      `access_key/${this.accountId}/${pubkey.toString()}`,
      ''
    );
    const nonce = ++accessKey.nonce;
    const recentBlockHash = utils.serialize.base_decode(accessKey.block_hash);
    const transaction = transactions.createTransaction(
      this.accountId,
      pubkey,
      opts.receiverAccountId,
      nonce,
      opts.actions,
      recentBlockHash
    );
    const serializedTx = utils.serialize.serialize(
      transactions.SCHEMA,
      transaction
    );
    const serializedTxHash = new Uint8Array(sha256.array(serializedTx));
    const signature = keyPair.sign(serializedTxHash);
    const signedTransaction = new transactions.SignedTransaction({
      transaction,
      signature: new transactions.Signature({
        keyType: transaction.publicKey.keyType,
        data: signature.signature,
      }),
    });
    // encodes transaction to serialized Borsh (required for all transactions)
    const signedSerializedTx = signedTransaction.encode();
    // sends transaction to NEAR blockchain via JSON RPC call and records the result
    const result = await this.provider.sendJsonRpc('broadcast_tx_commit', [
      Buffer.from(signedSerializedTx).toString('base64'),
    ]);
    const transactionLink = `https://explorer.${this.networkId}.near.org/transactions/${result.transaction.hash}`;
    return transactionLink;
  }
}
