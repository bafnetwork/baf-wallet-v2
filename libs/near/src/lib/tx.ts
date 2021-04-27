import {
  KeyPair,
  TxInterface,
  PublicKey,
  SecretKey,
  secp256k1,
  ed25519,
  Encoding,
  ExplorerLink
} from '@baf-wallet/interfaces';
import { Pair } from '@baf-wallet/utils';
import { sha256 } from '@baf-wallet/multi-chain';
import { Buffer } from 'buffer';
import BN from 'bn.js';
import {
  KeyPair as NearKeyPair,
  keyStores,
  providers,
  transactions,
  utils,
} from 'near-api-js';

import { NearState } from './near';
import { NearSendOpts, NearSendResult } from './rpc';
import { NearAccountID } from './accounts';
import { nearConverter } from './convert';
import { Action as NearNativeAction, SignedTransaction, Transaction } from 'near-api-js/lib/transaction';

export type NearTxInterface = TxInterface<Transaction, NearBuildTxParams, SignedTransaction, NearSignTxOpts, NearSendOpts, NearSendResult>;
export enum NearSupportedActionTypes {
  TRANSFER = 'transfer',
}
interface NearActionParam {
  // used to type check the parameter input
  discriminator: NearSupportedActionTypes;
}
export interface NearTransferParam extends NearActionParam {
  // a string number value in Yocto
  amount: string;
}
export interface NearAction {
  type: NearSupportedActionTypes;
  params: NearTransferParam | NearActionParam;
}
export interface NearBuildTxParams {
  actions: NearAction[];
  senderPk: PublicKey<ed25519 | secp256k1>;
  senderAccountID: NearAccountID;
  recipientAccountID: NearAccountID;
}
export interface NearSignTxOpts {}


export function nearTx(innerSdk: NearState): NearTxInterface {
  return {
    build: buildNearTx(innerSdk),
    sign: signNearTx,
    send: sendNearTx(innerSdk)
  }
}

function buildNativeAction(action: NearAction): NearNativeAction {
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


export const buildNearTx = (innerSdk: NearState) => async ({ actions, senderPk, senderAccountID, recipientAccountID }: NearBuildTxParams): Promise<Transaction> => {
  const nearSenderPk = nearConverter.pkFromUnified(senderPk);
  const accessKey = await innerSdk.rpcProvider.query(`access_key/${senderAccountID}/${nearSenderPk.toString()}`);

  const nonce = ++accessKey.nonce;
  const recentBlockHash = utils.serialize.base_decode(accessKey.block_hash);
  const nativeActions = actions.map(buildNativeAction);

  return transactions.createTransaction(
    senderAccountID,
    nearSenderPk,
    recipientAccountID,
    nonce,
    nativeActions,
    recentBlockHash
  )
}

export async function signNearTx<Curve>(tx: transactions.Transaction, keyPair: KeyPair<Curve>, _opts?: NearSignTxOpts): Promise<transactions.SignedTransaction> {
  const nearKeyPair = nearConverter.keyPairFromUnified(keyPair);
  const serializedTx = utils.serialize.serialize(transactions.SCHEMA, tx);
  const serializedTxHash = new Uint8Array(sha256(Buffer.from(serializedTx)));
  const signature = nearKeyPair.sign(serializedTxHash);
  return new transactions.SignedTransaction({
    tx,
    signature: new transactions.Signature({
      keyType: tx.publicKey.keyType,
      data: signature.signature,
    }),
  });
}

export const sendNearTx = (innerSdk: NearState) => async (tx: Transaction | SignedTransaction): Promise<Pair<NearSendResult, ExplorerLink>> => {
  const serialized = tx.encode();
  const result = await innerSdk.rpcProvider.sendJsonRpc('broadcast_tx_commit', [
    Buffer.from(serialized).toString('base64')
  ]);

  const explorerLink = `https://explorer.${innerSdk.networkID}.near.org/transactions/${result.transaction.hash}`;
  return {
    fst: result,
    snd: explorerLink
  }
}

