import { ed25519, PublicKey, secp256k1, SecretKey } from './crypto';

export interface KeyState {
  edPK: PublicKey<ed25519>;
  secpPK: PublicKey<secp256k1>;
  secpSK: SecretKey<secp256k1>;
  edSK: SecretKey<ed25519>;
}

export interface CreateTxReturn<TXParams> {
  txParams: TXParams;
  recipientUser: string;
}
