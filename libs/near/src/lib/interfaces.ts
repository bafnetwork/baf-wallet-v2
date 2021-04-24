import { Env } from '@baf-wallet/interfaces';

export enum NearNetworkID {
  DEVNET = 'testnet',
  TESTNET = 'testnet',
  MAINNET = 'mainnet',
}

export function getNearNetworkId(env: Env): NearNetworkID {
  switch (env) {
    case Env.DEV:
      return NearNetworkID.DEVNET;
    case Env.TEST:
      return NearNetworkID.TESTNET;
    case Env.PROD:
      return NearNetworkID.MAINNET;
    default:
      return NearNetworkID.DEVNET;
  }
}

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
