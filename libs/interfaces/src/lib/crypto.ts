import { Buffer } from 'buffer';

export type secp256k1 = {
  toString: () => 'secp256k1';
};

export type ed25519 = {
  toString: () => 'ed25519';
};

export const ED25519_STR = 'ed25519';
export const SECP256K1_STR = 'secp256k1';

export const secp256k1Marker: secp256k1 = { toString: () => SECP256K1_STR };
export const ed25519Marker: ed25519 = { toString: () => ED25519_STR };

export type SupportedCurve = secp256k1 | ed25519;

export enum Encoding {
  BS58,
  HEX,
}

export interface PublicKey<Curve> {
  data: Buffer;
  curve: Curve;
  format: (fmt: Encoding) => string;
}

export interface SecretKey<Curve> {
  data: Buffer;
  curve: Curve;
  format: (fmt: Encoding) => string;
}

export interface KeyPair<Curve> {
  curve: Curve;
  sk: SecretKey<Curve>;
  pk: PublicKey<Curve>;
}
/**
 * A hex encoded string for the signature where sig.s is concated with sig.r
 */
export type RustEncodedSecpSig = string;
