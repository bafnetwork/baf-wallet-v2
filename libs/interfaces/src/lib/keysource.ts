import { SupportedCurve, KeyPair } from './crypto';

export enum KeySourceMethod {
  TORUS,
  LOCAL_STORAGE,
  // e.g. file, ledger, brain, etc, as they are implemented
}

// `KeyID` is a type that represents the type used to "look up" a key
// in theory this could be the public key itself, but some source mechanisms
// may offer different ways of doing so, for instance the key for use in localStorage.setItem
// a file path, or a derived account number for a keypair stored on a ledger nano
export interface KeySource<KeyID> {
  method: KeySourceMethod;
  getKeyPair: <Curve>(
    keyID: KeyID,
    curveMarker: Curve
  ) => Promise<KeyPair<Curve> | null>;

  // these methods are for the off-chance that you don't know which curve a particular key-pair is on
  // to use this, you'd typically call this and then case on the returned value
  // for the vast majority of cases there will be only one curve used by a particular key source mechansim
  // so these method aren't required.
  // implementors are expected to implement either all of these methods or none of them.
  getKeyCurve?: (keyID: KeyID) => Promise<SupportedCurve>;
  getKeyPairUnknownCurve?: (keyID: KeyID) => Promise<KeyPair<SupportedCurve>>;
}

// then every keySource implementation should provide this function
export type KeySourceInitFn<KeyID, InitParams> = (params: InitParams) => Promise<KeySource<KeyID>>;

export type KeySourceInferKeyID<T> = T extends KeySource<infer KeyID> ? KeyID : never;
export type KeySourceInitFnInferInitParams<T> = T extends KeySourceInitFn<infer _, infer InitParams> ? InitParams : never;