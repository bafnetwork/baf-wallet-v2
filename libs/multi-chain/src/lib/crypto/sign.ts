import {
  SecretKey,
  PublicKey,
  KeyPair,
  secp256k1,
  ed25519,
  ED25519_STR,
  SECP256K1_STR,
  Encoding,
} from '@baf-wallet/interfaces';
import { keccak256, sha256 } from './hash';
import { ec as EC } from 'elliptic';
import * as nacl from 'tweetnacl';
import { encodeBytes } from '@baf-wallet/utils';
import { encodeSecpSigBafContract } from '@baf-wallet/baf-contract';

const ellipticSecp256k1 = new EC('secp256k1');

export function verifySignature<Curve>(
  pk: PublicKey<Curve>,
  msg: Buffer,
  signedMsg: Buffer,
  hashFn: (buf: Buffer) => Buffer = keccak256
): boolean {
  switch (pk.curve.toString()) {
    case SECP256K1_STR: {
      const msgHash = hashFn(msg);
      let validSig = ellipticSecp256k1.verify(
        msgHash,
        signedMsg,
        pk.data
      );
      return validSig;
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
  msg: Buffer | string,
  bafContractFormat = false,
  hashFn: (buf: Buffer) => Buffer = keccak256
): Buffer {
  const msgFormat =
    typeof msg === 'string' ? encodeBytes(msg, Encoding.HEX) : msg;
  switch (sk.curve.toString()) {
    case SECP256K1_STR: {
      const msgHash = hashFn(msgFormat);
      const ellipticSig = ellipticSecp256k1.sign(msgHash, sk.data, 'hex', {
        canonical: true
      })
      return bafContractFormat
        ? encodeSecpSigBafContract(ellipticSig)
        : Buffer.from(ellipticSig.toDER('hex'), 'hex');
    }
    case ED25519_STR: {
      const msgHash = hashFn(msgFormat);
      return Buffer.from(
        nacl.sign.detached(new Uint8Array(msgHash), new Uint8Array(sk.data))
      );
    }
    default:
      throw new Error(`Unsupported curve ${sk.curve.toString()}`);
  }
}
