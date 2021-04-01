import { Envs } from "./configs";

export enum NearNetworkId {
  DEVNET = 'devnet',
  TESTNET = 'testnet',
  MAINNET = 'mainnet',
}

export function getNearNetworkId(env: Envs) : NearNetworkId {
  switch (env) {
    case Envs.DEV:
      return NearNetworkId.DEVNET
    case Envs.TEST:
      return NearNetworkId.TESTNET
    case Envs.PROD:
      return NearNetworkId.MAINNET
    default:
      return NearNetworkId.DEVNET;
  }
}
