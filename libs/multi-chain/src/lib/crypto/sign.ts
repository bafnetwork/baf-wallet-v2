import {
  SecretKey,
  PublicKey,
  KeyPair,
  secp256k1,
  ed25519,
  ED25519_STR,
  SECP256K1_STR,
} from '@baf-wallet/interfaces';
import { sha256 } from './hash';
import { ec as EC } from 'elliptic';
import * as nacl from 'tweetnacl';

const ellipticSecp256k1 = new EC('secp256k1');

export function verifySignature<Curve>(
  pk: PublicKey<Curve>,
  msg: Buffer,
  signedMsg: Buffer,
  hashFn: (buf: Buffer) => Buffer = sha256
): boolean {
  switch (pk.curve.toString()) {
    case SECP256K1_STR: {
      const msgHash = hashFn(msg);
      const ecPublicKey = ellipticSecp256k1.keyFromPublic(pk.data);
      return ecPublicKey.verify(msgHash, signedMsg);
    }
    case ED25519_STR: {
      const msgHash = hashFn(msg);
      return nacl.sign.detached.verify(
        new Uint8Array(msgHash),
        new Uint8Array(signedMsg),
        new Uint8Array(pk.data)
      );
    }
    default:
      throw new Error(`Unsupported curve ${pk.curve.toString()}`);
  }
}

export function signMsg<Curve>(
  sk: SecretKey<Curve>,
  msg: Buffer,
  hashFn: (buf: Buffer) => Buffer = sha256
): Buffer {
  switch (sk.curve.toString()) {
    case SECP256K1_STR: {
      const msgHash = hashFn(msg);
      const ecPrivateKey = ellipticSecp256k1.keyFromPrivate(sk.data);
      const ellipticSig = ecPrivateKey.sign(msgHash);
      return Buffer.from(ellipticSig.toDER());
    }
    case ED25519_STR: {
      const msgHash = hashFn(msg);
      return Buffer.from(
        nacl.sign(new Uint8Array(msgHash), new Uint8Array(sk.data))
      );
    }
    default:
      throw new Error(`Unsupported curve ${sk.curve.toString()}`);
  }
}
