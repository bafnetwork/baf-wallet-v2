import * as interfaces from '@baf-wallet/interfaces';

export interface KeyState {
  ed25519Pubkey: interfaces.PublicKey;
  secp256k1Pubkey: interfaces.PublicKey;
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
