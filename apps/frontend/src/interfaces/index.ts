import type {
  ed25519,
  PublicKey,
  secp256k1,
  SecretKey,
} from '@baf-wallet/interfaces';

export interface KeyState {
  edPk: PublicKey<ed25519>;
  edSk: SecretKey<ed25519>;
  secpPk: PublicKey<secp256k1>;
  secpSk: SecretKey<secp256k1>;
}

export interface Balance {
  tok: TOKEN;
  balance: string | number;
}

export enum TOKEN {
  Near = 'near',
  Eth = 'eth',
}
