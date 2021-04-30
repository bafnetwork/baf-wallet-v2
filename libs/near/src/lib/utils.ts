import { Env } from '@baf-wallet/interfaces';

export enum NearNetworkID {
  DEVNET = 'testnet',
  TESTNET = 'testnet',
  MAINNET = 'mainnet',
}

export function stringToNetworkID(str: string): NearNetworkID {
  switch (str) {
    case NearNetworkID.DEVNET:
      return NearNetworkID.DEVNET;
    case NearNetworkID.TESTNET:
      return NearNetworkID.TESTNET;
    case NearNetworkID.MAINNET:
      return NearNetworkID.MAINNET;
    default:
      throw new Error(`Unknown network identifier ${str}`);
  }
}

export function getNearNetworkID(env: Env): NearNetworkID {
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
