import { Account as NearAccount } from 'near-api-js';
// TODO: have some intelligent way to get the rest
export enum ChainName {
  ETH = 'ethereum',
  BTC = 'bitcoin',
  NEAR = 'near',
  SOLANA = 'solana',
  COSMOS = 'cosmos',
  CELO = 'celo',
  DOT = 'polkadot',
  FILECOIN = 'filecoin',
  HARMONEY = 'harmony',
  ALGORAND = 'algorand',
  AVALANCHE = 'avalanche',
  MATIC = 'matic',
  DOGE = 'doge',
  TERRA = 'terra',
}

// Or the type with all the supported chain account types
export type ChainAccount = NearAccount;

export type Balance = string;
