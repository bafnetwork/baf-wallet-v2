import {
  RpcInterface,
  JsonRpcResult,
  makeJsonRpc,
} from '@baf-wallet/interfaces';
import { BafError } from '@baf-wallet/errors';
import { transactions } from 'near-api-js';
import { NearNetworkID, stringToNetworkID } from './utils';
import { NearState } from './near';
import axios from 'axios';

export type NearRpcInterface = RpcInterface<
  transactions.Transaction,
  transactions.SignedTransaction,
  NearSendOpts,
  NearSendResult
>;

export type NearResponseOk = ViewAccountOk;
export type NearResponseErr = ViewAccountErr;

// TODO: go spelunking in near's jsonRpcProvider and see what options it takes
// and see what kind of stuff it actually returns so we can do better than 'any'
export interface NearSendOpts {}
export type NearSendResult = JsonRpcResult<NearResponseOk, NearResponseErr>;

// * add more RPC methods as they are needed

export const nearRpc: NearRpcInterface = {
  endpoint: getNodeUrl,
  other: {
    viewAccount,
  },
};

export function getNodeUrl(network?: string): string {
  const networkID: NearNetworkID = stringToNetworkID(network ?? 'mainnet');
  return `https://rpc.${networkID}.near.org`;
}

export interface ViewAccountOk {
  amount: string;
  locked: string;
  code_hash: string;
  storage_usage: number;
  storage_paid_at: number;
  block_height: number;
  block_hash: string;
}

export interface ViewAccountErr {
  code: number;
  message: string;
  data: string;
}

export interface ViewAccountArgs {
  accountID: string;
  finality?: string;
}

async function viewAccount(
  args: ViewAccountArgs,
  network?: string
): Promise<JsonRpcResult<ViewAccountOk, ViewAccountErr>> {
  const url = getNodeUrl(network);
  const sendArgs = makeJsonRpc(args, 'query');
  const res = await axios.post(url, sendArgs);
  if (res.status !== 200) {
    throw BafError.RpcFailure(url, 'failed to call view_account');
  }

  return res.data as JsonRpcResult<ViewAccountOk, ViewAccountErr>;
}
