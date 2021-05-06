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
  GenericTxActionTransferContractToken,
  Chain,
} from '@baf-wallet/interfaces';
import { Pair, getEnumValues } from '@baf-wallet/utils';
import { sha256 } from '@baf-wallet/crypto';
import { Buffer } from 'buffer';
import BN from 'bn.js';
import { KeyPair as NearKeyPair, transactions, utils } from 'near-api-js';

import { NearState } from './near';
import { NearSendOpts, NearSendResult } from './rpc';
import { NearAccountID } from './accounts';
import { nearConverter } from './convert';
import {
  Action as NearNativeAction,
  SignedTransaction,
  Transaction,
} from 'near-api-js/lib/transaction';
import { getBafContract } from '@baf-wallet/baf-contract';
import { BafError } from '@baf-wallet/errors';

export type NearTxInterface = TxInterface<
  Transaction,
  NearBuildTxParams,
  SignedTransaction,
  NearSignTxOpts,
  NearSendOpts,
  NearSendResult
>;
export type NearSupportedActionTypes = GenericTxSupportedActions;
export type NearTransaction = Transaction;

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
    extractGenericActionsFromTx,
  };
}

function buildNativeAction(
  receiverId: string,
  action: NearAction,
  innerSdk: NearState
): NearNativeAction {
  const actionType = action.type;
  switch (actionType) {
    case GenericTxSupportedActions.TRANSFER:
      return transactions.transfer(
        new BN((action as GenericTxActionTransfer).amount, 10)
      );
    case GenericTxSupportedActions.TRANSFER_CONTRACT_TOKEN:
      const params = action as GenericTxActionTransferContractToken;
      return transactions.functionCall(
        'ft_transfer',
        {
          receiver_id: receiverId,
          amount: params.amount,
          memo: params.memo,
        },
        // TODO: maximum gas fees per chain: see https://github.com/bafnetwork/baf-wallet-v2/issues/68
        new BN(10000000000000), // Maximum gas fee
        new BN(1) // A deposit associated with the ft_transfer action
      );
    default:
      throw `Action of type ${actionType} is unsupported`;
  }
}

const checkAllContractActions = (actions: NearAction[]) => {
  if (!actions.every(isContractCall)) {
    return false;
  }
  if (actions.length === 0) {
    return true;
  }

  const contract = (actions[0] as GenericTxActionTransferContractToken)
    .contractAddress;
  for (let i = 1; i < actions.length; i++) {
    if (
      (actions[i] as GenericTxActionTransferContractToken).contractAddress !==
      contract
    ) {
      return false;
    }
  }
  return true;
};

const isContractCall = (action: NearAction) =>
  action.type === GenericTxSupportedActions.TRANSFER_CONTRACT_TOKEN;

export const extractGenericActionsFromTx = (
  txParams: NearBuildTxParams
): GenericTxAction[] => {
  return txParams.actions;
};

export const buildParamsFromGenericTx = (innerSdk: NearState) => async (
  txParams: GenericTxParams,
  recipientPk: PublicKey<secp256k1>,
  _senderPk: PublicKey<secp256k1>,
  senderPk: PublicKey<ed25519>
): Promise<NearBuildTxParams> => {
  const recipientAccountID = await getBafContract().getAccountId(recipientPk);
  const nearTxParams: NearBuildTxParams = {
    actions: txParams.actions,
    senderPk: senderPk,
    senderAccountID: innerSdk.nearMasterAccount.accountId,
    recipientAccountID,
  };
  return nearTxParams;
};

export const buildNearTx = (innerSdk: NearState) => async ({
  actions,
  senderPk,
  senderAccountID,
  recipientAccountID,
}: NearBuildTxParams): Promise<Transaction> => {
  if (actions.some(isContractCall) && !checkAllContractActions(actions)) {
    throw BafError.NonuniformTxActionRecipients(Chain.NEAR);
  }
  const nearSenderPk = nearConverter.pkFromUnified(senderPk);
  const accessKey = await innerSdk.rpcProvider.query(
    `access_key/${senderAccountID}/${nearSenderPk.toString()}`,
    ''
  );

  const nonce = ++accessKey.nonce;
  const recentBlockHash = utils.serialize.base_decode(accessKey.block_hash);
  const nativeActions = actions.map((action) =>
    buildNativeAction(recipientAccountID, action, innerSdk)
  );

  const transactionRecipient =
    actions.some(isContractCall) && actions.length > 0
      ? (actions[0] as GenericTxActionTransferContractToken).contractAddress
      : recipientAccountID;

  return transactions.createTransaction(
    senderAccountID,
    nearSenderPk,
    transactionRecipient,
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
