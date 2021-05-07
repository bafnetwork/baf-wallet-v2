import { ed25519, PublicKey, secp256k1 } from './crypto';
import { PLATFORM } from './platforms';

export enum GenericTxSupportedActions {
  TRANSFER = 'transfer',
  TRANSFER_CONTRACT_TOKEN = 'transfer contract token',
}

export interface GenericTxParams {
  recipientUserId?: string;
  recipientUserIdReadable?: string;
  oauthProvider?: PLATFORM;
  actions: GenericTxAction[];
}

interface GenericTxActionBase {
  type: GenericTxSupportedActions;
}

export interface GenericTxActionTransfer extends GenericTxActionBase {
  type: GenericTxSupportedActions.TRANSFER;
  // Amount is the quantity of the minimal sendable unit for a currency
  amount: string;
}

// A contract token connotes an ERC21 token, SPL token,  NEP 141 token etc
export interface GenericTxActionTransferContractToken
  extends GenericTxActionBase {
  type: GenericTxSupportedActions.TRANSFER_CONTRACT_TOKEN;
  // Contract Address or Account ID
  contractAddress: string;
  // Amount is the quantity of the minimal sendable unit for a currency
  amount: string;
  // An optional string with which to associate a transfer. Some chains support this as a feature
  memo?: string;
}

// To be or'd with whatever other actions we use
export type GenericTxAction =
  | GenericTxActionTransfer
  | GenericTxActionTransferContractToken;

/**
 * TODO: add NFT Support
 */
export enum SupportedTransferTypes {
  NativeToken = 'Native Token',
  ContractToken = 'Contract Token',
}
