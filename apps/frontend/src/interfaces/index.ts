import type { PublicKey, SecretKey, ChainName } from '@baf-wallet/interfaces';
// import { ChainName } from '@baf-wallet/trust-wallet-assets';

export interface KeyState {
  edPK: PublicKey;
  secpPK: PublicKey;
  secpSK: SecretKey;
  edSK: SecretKey;
}

export interface Balance {
  tok: ChainName;
  balance: string | number;
}
