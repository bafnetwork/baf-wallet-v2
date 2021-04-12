import type { PublicKey, SecretKey } from '@baf-wallet/interfaces';

export interface KeyState {
  ed25519Pubkey: PublicKey;
  secp256k1Pubkey: PublicKey;
  secret: any;
}

export interface Balance {
  tok: TOKEN;
  balance: string | number;
}

export enum TOKEN {
  Near = 'Near',
  Eth = 'Eth',
}
