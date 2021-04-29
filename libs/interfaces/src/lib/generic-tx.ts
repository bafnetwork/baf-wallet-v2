import { PLATFORM } from "./platforms";

export enum GenericTxSupportedActions {
  TRANSFER = 'transfer'
}

export interface GenericTxParams {
  recipientUserId: string;
  oauthProvider: PLATFORM;
  actions: GenericTxAction[]
}

interface GenericTxActionBase {
  type: GenericTxSupportedActions
}

export interface GenericTxActionTransfer extends GenericTxActionBase {
  type: GenericTxSupportedActions.TRANSFER,
  // Amount is the quantity of the minimal sendable unit for a currency
  amount: string;
}

// To be or'd with whatever other actions we use
export type GenericTxAction = GenericTxActionTransfer