import { Envs } from './configs';

export enum NearNetworkId {
  DEVNET = 'testnet',
  TESTNET = 'testnet',
  MAINNET = 'mainnet',
}

export function getNearNetworkId(env: Envs): NearNetworkId {
  switch (env) {
    case Envs.DEV:
      return NearNetworkId.DEVNET;
    case Envs.TEST:
      return NearNetworkId.TESTNET;
    case Envs.PROD:
      return NearNetworkId.MAINNET;
    default:
      return NearNetworkId.DEVNET;
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
