import {
  SecretKey,
  PublicKey,
  ED25519_STR,
  SECP256K1_STR,
  Encoding,
} from '@baf-wallet/interfaces';
import { keccak256, sha256 } from './hash';
import { ec as EC } from 'elliptic';
import * as nacl from 'tweetnacl';
import { encodeBytes } from '@baf-wallet/utils';
import { BafError } from '@baf-wallet/errors';

const ellipticSecp256k1 = new EC('secp256k1');

export function verifySignature<Curve>(
  pk: PublicKey<Curve>,
  msg: Buffer | string,
  signedMsg: Buffer,
  hashFn: (buf: Buffer) => Buffer = keccak256
): boolean {
  const msgFormat =
    typeof msg === 'string' ? encodeBytes(msg, Encoding.UTF8) : msg;
  switch (pk.curve.toString()) {
    case SECP256K1_STR: {
      const msgHash = hashFn(msgFormat);
      let validSig = ellipticSecp256k1.verify(msgHash, signedMsg, pk.data);
      return validSig;
    }
    case ED25519_STR: {
      const msgHash = hashFn(msgFormat);
      return nacl.sign.detached.verify(
        new Uint8Array(msgHash),
        new Uint8Array(signedMsg),
        new Uint8Array(pk.data)
      );
    }
    default:
      throw BafError.UnsupportedKeyCurve(pk.curve.toString());
  }
}

export function signMsg<Curve>(
  sk: SecretKey<Curve>,
  msg: Buffer | string,
  bafContractFormat = false,
  hashFn: (buf: Buffer) => Buffer = keccak256
): Buffer {
  const msgFormat =
    typeof msg === 'string' ? encodeBytes(msg, Encoding.UTF8) : msg;
  switch (sk.curve.toString()) {
    case SECP256K1_STR: {
      const msgHash = hashFn(msgFormat);
      const ellipticSig = ellipticSecp256k1.sign(msgHash, sk.data, 'hex', {
        canonical: true,
      });
      return bafContractFormat
        ? encodeSecpSigRustContract(ellipticSig)
        : Buffer.from(ellipticSig.toDER('hex'), 'hex');
    }
    case ED25519_STR: {
      const msgHash = hashFn(msgFormat);
      return Buffer.from(
        nacl.sign.detached(new Uint8Array(msgHash), new Uint8Array(sk.data))
      );
    }
    default:
      throw BafError.UnsupportedKeyCurve(sk.curve.toString());
  }
}

export function encodeSecpSigRustContract(sig: EC.Signature): Buffer {
  return Buffer.from(
    `${sig.r.toString('hex', 64)}${sig.s.toString('hex', 64)}`,
    'hex'
  );
}
