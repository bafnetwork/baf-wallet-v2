import {
  KeyPair,
  TxInterface,
  SecretKey,
  secp256k1,
  ed25519,
  Encoding,
} from '@baf-wallet/interfaces';
import {
  KeyPair as NearKeyPair,
  keyStores,
  providers,
  transactions,
  utils,
} from 'near-api-js';
import {
  NearAction,
  NearSupportedActionTypes,
  NearTransferParam,
  NearNetworkID,
} from './near';
import { sha256 } from 'js-sha256';
import { Buffer } from 'buffer';
import { formatKey } from '@baf-wallet/utils';
import { Action as NearNativeAction } from 'near-api-js/lib/transaction';
import BN from 'bn.js';

export interface NearSignTxOpts {
  tx: transactions.Transaction;
  keyPair: KeyPair<ed25519> | KeyPair<secp256k1> | NearKeyPair;
}

export interface NearSendTxOpts {
  actions: NearAction[];
  receiverAccountId: string;
}

export class NearSigner extends Signer<
  NearSendTxOpts,
  transactions.Transaction
> {
  private keyStore: keyStores.InMemoryKeyStore;
  private initProm: Promise<void>;
  private provider: providers.JsonRpcProvider;

  constructor(
    privKey: SecretKey,
    private accountId: string,
    private networkId: NearNetworkId
  ) {
    super(Chain.NEAR);
    this.keyStore = new keyStores.InMemoryKeyStore();
    const keyPair = KeyPair.fromString(privKey.format(Encoding.bs58));
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

  private buildNativeAction(action: NearAction): NearNativeAction {
    switch (action.type) {
      case NearSupportedActionTypes.TRANSFER:
        if (action.params.discriminator !== NearSupportedActionTypes.TRANSFER) {
          throw 'the input parameters do not match the call';
        }
        return transactions.transfer(
          new BN((action.params as NearTransferParam).amount)
        );
      default:
        throw `Action of type ${action.type} is unsupported`;
    }
  }

  public async createTX(
    opts: NearSendTXOpts
  ): Promise<transactions.Transaction> {
    const keyPair = await this.keyStore.getKey(this.networkId, this.accountId);
    const pubkey = keyPair.getPublicKey();
    const accessKey = await this.provider.query(
      `access_key/${this.accountId}/${pubkey.toString()}`,
      ''
    );
    const nonce = ++accessKey.nonce;
    const recentBlockHash = utils.serialize.base_decode(accessKey.block_hash);

    return transactions.createTransaction(
      this.accountId,
      pubkey,
      opts.receiverAccountId,
      nonce,
      opts.actions.map(this.buildNativeAction),
      recentBlockHash
    );
  }

  public async signTX(tx: transactions.Transaction): Promise<Uint8Array> {
    const keyPair = await this.keyStore.getKey(this.networkId, this.accountId);
    const serializedTx = utils.serialize.serialize(transactions.SCHEMA, tx);
    const serializedTxHash = new Uint8Array(sha256.array(serializedTx));
    const signature = keyPair.sign(serializedTxHash);
    const signedTransaction = new transactions.SignedTransaction({
      tx,
      signature: new transactions.Signature({
        keyType: tx.publicKey.keyType,
        data: signature.signature,
      }),
    });
    // encodes transaction to serialized Borsh (required for all transactions)
    const signedSerializedTx = signedTransaction.encode();
    return signedSerializedTx;
  }

  public async sendTX(signedTX: Uint8Array): Promise<string> {
    // sends transaction to NEAR blockchain via JSON RPC call and records the result
    const result = await this.provider.sendJsonRpc('broadcast_tx_commit', [
      Buffer.from(signedTX).toString('base64'),
    ]);
    const transactionLink = `https://explorer.${this.networkId}.near.org/transactions/${result.transaction.hash}`;
    return transactionLink;
  }
}
