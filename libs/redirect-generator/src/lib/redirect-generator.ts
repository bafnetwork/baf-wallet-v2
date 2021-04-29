import { Chain } from '@baf-wallet/interfaces';

export interface SendMoneyParams {
  amount: string;
  userId: string;
}

export const createSendURL = (
  chain: Chain,
  baseURL: string,
  opts: SendMoneyParams
) => {};

const createApproveRedirectURL = (chain: Chain, action: string, baseURL: string, opts: any) => {
  return `${baseURL}/approve-redirect/${action}?chain=${chain.toString()}&opts=${JSON.stringify(
    opts
  )}`;
};
