import {
  KeyPair,
  TxInterface,
  PublicKey,
  secp256k1,
  ed25519,
  ExplorerLink,
  GenericTxParams,
  GenericTxSupportedActions,
  GenericTxAction,
  GenericTxActionTransfer,
} from '@baf-wallet/interfaces';
import { Pair, getEnumValues } from '@baf-wallet/utils';
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
import {
  Action as NearNativeAction,
  SignedTransaction,
  Transaction,
  signTransaction,
} from 'near-api-js/lib/transaction';
import { getBafContract } from '@baf-wallet/baf-contract';

export type NearTxInterface = TxInterface<
  Transaction,
  NearBuildTxParams,
  SignedTransaction,
  NearSignTxOpts,
  NearSendOpts,
  NearSendResult
>;
export type NearSupportedActionTypes = GenericTxSupportedActions;
export type NearTransaction = Transaction
interface NearActionParam {
  // used to type check the parameter input
  discriminator: NearSupportedActionTypes;
}
export interface NearTransferParam extends NearActionParam {
  // a string number value in Yocto
  amount: string;
}
export type NearAction = GenericTxAction;
export interface NearBuildTxParams {
  actions: NearAction[];
  senderPk: PublicKey<ed25519>;
  senderAccountID: NearAccountID;
  recipientAccountID: NearAccountID;
}
export interface NearSignTxOpts {}

export function nearTx(innerSdk: NearState): NearTxInterface {
  return {
    build: buildNearTx(innerSdk),
    sign: signNearTx,
    send: sendNearTx(innerSdk),
    buildParamsFromGenericTx: buildParamsFromGenericTx(innerSdk),
  };
}

function buildNativeAction(action: NearAction): NearNativeAction {
  switch (action.type) {
    case GenericTxSupportedActions.TRANSFER:
      return transactions.transfer(
        new BN((action as GenericTxActionTransfer).amount, 10)
      );
    default:
      throw `Action of type ${action.type} is unsupported`;
  }
}

export const buildParamsFromGenericTx = (innerSdk: NearState) => async (
  txParams: GenericTxParams,
  recipientPk: PublicKey<secp256k1>,
  _senderPk: PublicKey<secp256k1>,
  senderPk: PublicKey<ed25519>
): Promise<NearBuildTxParams> => {
  const recipientAccountID = await getBafContract().getAccountId(recipientPk);
  const nearTransferParams: NearBuildTxParams = {
    actions: txParams.actions,
    senderPk: senderPk,
    senderAccountID: innerSdk.nearMasterAccount.accountId,
    recipientAccountID,
  };
  return nearTransferParams;
};

export const buildNearTx = (innerSdk: NearState) => async ({
  actions,
  senderPk,
  senderAccountID,
  recipientAccountID,
}: NearBuildTxParams): Promise<Transaction> => {
  const nearSenderPk = nearConverter.pkFromUnified(senderPk);
  const accessKey = await innerSdk.rpcProvider.query(
    `access_key/${senderAccountID}/${nearSenderPk.toString()}`,
    ''
  );

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
  );
};

export async function signNearTx<Curve>(
  tx: transactions.Transaction,
  keyPair: KeyPair<Curve>,
  _opts?: NearSignTxOpts
): Promise<transactions.SignedTransaction> {
  const nearKeyPair = nearConverter.keyPairFromUnified(keyPair);
  const serializedTx = utils.serialize.serialize(transactions.SCHEMA, tx);
  const serializedTxHash = new Uint8Array(sha256(Buffer.from(serializedTx)));
  const signature = nearKeyPair.sign(serializedTxHash);
  // const [_, signedTx] = await signTransaction(tx, )
  return new transactions.SignedTransaction({
    transaction: tx,
    signature: new transactions.Signature({
      keyType: tx.publicKey.keyType,
      data: signature.signature,
    }),
  });
}

export const sendNearTx = (innerSdk: NearState) => async (
  tx: SignedTransaction
): Promise<Pair<NearSendResult, ExplorerLink>> => {
  const serialized = tx.encode();
  const result = await innerSdk.rpcProvider.sendJsonRpc('broadcast_tx_commit', [
    Buffer.from(serialized).toString('base64'),
  ]);

  const explorerLink = `https://explorer.${innerSdk.networkID}.near.org/transactions/${result.transaction.hash}`;
  return {
    fst: result,
    snd: explorerLink,
  };
};
