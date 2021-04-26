export type secp256k1 = {
  toString: () => "secp256k1"
};

export type ed25519 = {
  toString: () => "ed25519"
};

export const secp256k1Marker: secp256k1 = {
  toString: () => "secp256k1"
};

export const ed25519Marker: ed25519 = {
  toString: () => "ed25519"
};

export type SupportedCurve = secp256k1 | ed25519;

export enum Encoding {
  bs58,
  hex,
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