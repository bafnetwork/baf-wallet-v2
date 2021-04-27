import {
  PublicKey,
  SecretKey,
  KeyPair,
  SECP256K1_STR,
  ED25519_STR,
} from '@baf-wallet/interfaces';
import { bufferConverter } from '@baf-wallet/utils';
import { ec as EC } from 'elliptic';
import * as nacl from 'tweetnacl';

const ellipticSecp256k1 = new EC('secp256k1');

export function keyPairFromSk<Curve>(sk: SecretKey<Curve>): KeyPair<Curve> {
  const pk = pkFromSk(sk);
  return {
    curve: sk.curve,
    pk,
    sk,
  }
}

export function pkFromSk<Curve>(sk: SecretKey<Curve>): PublicKey<Curve> {
  switch (sk.curve.toString()) {
    case SECP256K1_STR: {
      const data = Buffer.from(
        ellipticSecp256k1.keyFromPrivate(sk.data).getPublic(false, 'hex'),
        'hex'
      );

      return bufferConverter.pkToUnified(data, sk.curve);
    }
    case ED25519_STR: {
      const data = Buffer.from(
        nacl.sign.keyPair.fromSecretKey(new Uint8Array(sk.data)).publicKey
      );

      return bufferConverter.pkToUnified(data, sk.curve);
    }
    default:
      throw new Error(`Unsupported curve ${sk.curve.toString()}`);
  }
}

export function skFromSeed<Curve>(
  seed: Uint8Array,
  curveMarker: Curve
): SecretKey<Curve> {
  switch (curveMarker.toString()) {
    case SECP256K1_STR: {
      const entropy = nacl.hash(seed);
      const ellipticSk = ellipticSecp256k1
        .genKeyPair({ entropy })
        .getPrivate('hex');

      const data = Buffer.from(ellipticSk, 'hex');
      return bufferConverter.skToUnified(data, curveMarker);
    }
    case ED25519_STR: {
      const data = Buffer.from(
        nacl.sign.keyPair.fromSeed(new Uint8Array(Buffer.from(seed))).secretKey
      );

      return bufferConverter.pkToUnified(data, curveMarker);
    }
    default:
      throw new Error(`Unsupported curve ${curveMarker.toString()}`);
  }
}

export function skFromRng<Curve>(curveMarker: Curve): SecretKey<Curve> {
  switch (curveMarker.toString()) {
    case SECP256K1_STR: {
      const data = Buffer.from(nacl.sign.keyPair().secretKey);
      return bufferConverter.skToUnified(data, curveMarker);
    }
    case ED25519_STR: {
      const data = Buffer.from(
        ellipticSecp256k1.genKeyPair().getPrivate('hex'),
        'hex'
      );
      return bufferConverter.pkToUnified(data, curveMarker);
    }
    default:
      throw new Error(`Unsupported curve ${curveMarker.toString()}`);
  }
}
