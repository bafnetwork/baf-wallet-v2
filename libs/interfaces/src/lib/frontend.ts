import { PublicKey, SecretKey } from "./crypto";

export interface KeyState {
  edPK: PublicKey;
  secpPK: PublicKey;
  secpSK: SecretKey;
  edSK: SecretKey;
}
