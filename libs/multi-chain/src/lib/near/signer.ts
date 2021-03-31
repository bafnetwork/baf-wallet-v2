import { Signer } from '../interfaces/base-classes';
import {
  KeyPair,
  keyStores,
  providers,
  transactions,
  utils,
} from 'near-api-js';
import { Chain } from '../interfaces/chains';
import { NetworkId } from './types';
import { sha256 } from 'js-sha256';

interface NearSendOpts {
  actions: transactions.Action[];
  receiverAccountId: string;
}

export class NearSigner extends Signer {
  keyStore: keyStores.InMemoryKeyStore;
  initProm: Promise<void>;
  provider: providers.JsonRpcProvider;

  constructor(
    privKey: string,
    private accountId: string,
    private networkId: NetworkId
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

  async awaitConstructorInit() {
    return this.initProm;
  }

  async sendTX(opts: NearSendOpts) {
    const keyPair = await this.keyStore.getKey(this.networkId, this.accountId);
    const pubkey = keyPair.getPublicKey();
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
