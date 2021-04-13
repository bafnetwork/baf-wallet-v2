export enum CryptoCurves {
  secp256k1 = 'secp256k1',
  ed25519 = 'ed25519',
}

export enum KeyFormats {
  bs58,
  hex,
}

export type PublicKey = Buffer;
export type SecretKey = Buffer;
