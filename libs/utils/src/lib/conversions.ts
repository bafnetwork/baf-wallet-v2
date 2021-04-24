import {
  Converter,
  SecretKey,
  PublicKey,
  Encoding,
  KeyPair,
} from '@baf-wallet/interfaces';
import { formatBytes } from './bytes';
import { Pair } from './types';
import { Buffer } from 'buffer';

export const bufferConverter: Converter = {
  skFromBaf,
  skToBaf,
  pkFromBaf,
  pkToBaf,
  keyPairFromBaf,
  keyPairToBaf,
};

function skFromBaf<Curve>(bafSk: SecretKey<Curve>): Buffer {
  return Buffer.from(bafSk.data);
}

function skToBaf<Curve>(sk: Buffer, curveMarker: Curve): SecretKey<Curve> {
  const data = Buffer.from(sk);
  return {
    data,
    curve: curveMarker,
    format: (fmt: Encoding) => formatBytes(data, fmt),
  };
}

function pkFromBaf<Curve>(bafPk: PublicKey<Curve>): Buffer {
  return Buffer.from(bafPk.data);
}

function pkToBaf<Curve>(pk: Buffer, curveMarker: Curve): PublicKey<Curve> {
  const data = Buffer.from(pk);
  return {
    data,
    curve: curveMarker,
    format: (fmt: Encoding) => formatBytes(data, fmt),
  };
}

function keyPairFromBaf<Curve>(
  bafKeyPair: KeyPair<Curve>
): Pair<Buffer, Buffer> {
  const { pk, sk } = bafKeyPair;
  return {
    fst: Buffer.from(sk.data),
    snd: Buffer.from(pk.data),
  };
}

function keyPairToBaf<Curve>(
  keyPair: Pair<Buffer, Buffer>,
  curveMarker: Curve
): KeyPair<Curve> {
  const skBytes = keyPair.fst;
  const pkBytes = keyPair.snd;
  return {
    curve: curveMarker,
    sk: skToBaf(skBytes, curveMarker),
    pk: pkToBaf(pkBytes, curveMarker),
  };
}
