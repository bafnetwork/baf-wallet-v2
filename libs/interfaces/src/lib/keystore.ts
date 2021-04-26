import { SupportedCurve, SecretKey, KeyPair, PublicKey } from './crypto';

export enum KeyStorageMethod {
    torus,
    localStorage,
    // e.g. file, ledger, brain, etc, as they are implemented
}

// `KeyID` is a type that represents the type used to "look up" a key
// in theory this could be the public key itself, but some storage mechanisms
// may offer different ways of doing so, for instance the key for use in localStorage.setItem
// a file path, or a derived account number for a keypair stored on a ledger nano
export interface KeyStorage<KeyID> {
    method: KeyStorageMethod;
    setKeyPair: <Curve>(keyID: KeyID, key: SecretKey<Curve> | KeyPair<Curve>) => Promise<void>;
    getKeyPair: <Curve>(keyID: KeyID, curveMarker: Curve) => Promise<KeyPair<Curve>>;
    getPublicKey: <Curve>(keyID: KeyID, curveMarker: Curve) => Promise<PublicKey<Curve>>

    // these methods are for the off-chance that you don't know which curve a particular key-pair is on
    // to use this, you'd typically call this and then case on the returned value
    // for the vast majority of cases there will be only one curve used by a particular storage mechansim
    // so these method aren't required.
    // implementors are expected to implement either all of these methods or none of them.
    getKeyCurve?: (keyID: KeyID) => Promise<SupportedCurve>;
    setKeyPairUnknownCurve?: (keyID: KeyID) => Promise<KeyPair<SupportedCurve>>;
    getKeyPairUnknownCurve?: (keyID: KeyID) => Promise<KeyPair<SupportedCurve>>;
    getPublicKeyUnknownCurve?: (keyID: KeyID) => Promise<PublicKey<SupportedCurve>>;
}