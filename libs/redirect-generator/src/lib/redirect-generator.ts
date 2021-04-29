import { Chain, PLATFORM } from '@baf-wallet/interfaces';
import { deserializeData, serializeData } from '@baf-wallet/utils';

export enum TxAction {
  TRANSFER = 'transfer',
}

const txActions: string[] = Object.keys(TxAction).map((key) =>
  TxAction[key].toString()
);

export interface TransferParams {
  // Amount is the quantity of the minimal sendable unit for a currency
  amount: string;
  recipientUserId: string;
  oauthProvider: PLATFORM;
}

export const createTransferURL = (
  chain: Chain,
  baseURL: string,
  opts: TransferParams
) => {
  return createApproveRedirectURL(chain, TxAction.TRANSFER, baseURL, opts);
};

// TODO: interface check
export const deserializeTxParams = <Params>(paramsEncoded: string): Params => {
  return deserializeData(decodeURIComponent(paramsEncoded)) as Params;
};

const createApproveRedirectURL = (
  chain: Chain,
  action: TxAction,
  baseURL: string,
  opts: any
) => {
  return encodeURI(
    `${baseURL}/#/approve-redirect/${action}/${chain.toString()}/${encodeURIComponent(
      serializeData(opts)
    )}`
  );
};

export function convertTxAction(actionStr: string): TxAction {
  console.log(actionStr, Object.keys(TxAction));
  if (!txActions.includes(actionStr)) {
    throw 'Invalid action';
  }
  return actionStr as TxAction;
}
