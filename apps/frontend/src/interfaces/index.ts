import type { PublicKey, SecretKey } from '@baf-wallet/interfaces';

export interface KeyState {
  edPK: PublicKey;
  secpPK: PublicKey;
  secpSK: SecretKey;
  edSK: SecretKey
}

export interface Balance {
  tok: TOKEN;
  balance: string | number;
}

export enum TOKEN {
  Near = 'near',
  Eth = 'eth',
}
