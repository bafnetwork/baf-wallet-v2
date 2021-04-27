
import { RpcInterface } from '@baf-wallet/interfaces';
import { transactions } from 'near-api-js';
import { NearNetworkID, stringToNetworkID } from './utils';
import { NearState } from './near';

export type NearRpcInterface = RpcInterface<transactions.Transaction, transactions.SignedTransaction, NearSendOpts, NearSendResult>;

// TODO: go spelunking in near's jsonRpcProvider and see what options it takes
// and see what kind of stuff it actually returns so we can do better than 'any'
export interface NearSendOpts {}
export type NearSendResult = any;

// * add more RPC methods as they are needed

export function nearRpc(_innerSdk: NearState): NearRpcInterface {
    return {
        endpoint: getNodeUrl
    }
}

export function getNodeUrl(network?: string): string {
    const networkID: NearNetworkID = stringToNetworkID(network ?? 'mainnet');
    return `https://rpc.${networkID}.near.org`;
}
