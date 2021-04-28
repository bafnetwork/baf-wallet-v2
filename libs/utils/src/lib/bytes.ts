import { Encoding, PublicKey, SecretKey } from '@baf-wallet/interfaces';
import * as bs58 from 'bs58';

export function formatBytes(buf: Buffer, fmt = Encoding.HEX) {
  switch (fmt) {
    case Encoding.HEX:
      return Buffer.from(buf).toString('hex');
    case Encoding.BS58:
      return bs58.encode(Buffer.from(buf));
    default:
      throw "Encoding type not supported"
  }
}

export function encodeBytes(str: string, fmt: Encoding): Buffer {
  switch (fmt) {
    case Encoding.HEX:
      return Buffer.from(str, 'hex');
    case Encoding.BS58:
      return bs58.encode(str);
    case Encoding.UTF8:
      return Buffer.from(str, 'utf8');
    default:
      throw "Encoding type not supported"
  }
}

export function pkToArray<Curve>(key: PublicKey<Curve>) : number[] {
  return [...key.data]
}

export function pkToString<Curve> (
  key: PublicKey<Curve>,
  keyFormat = Encoding.HEX,
): string {
  return formatBytes(key.data, keyFormat)
}

export function pkFromString<Curve>(
  key: string,
  curve: Curve,
  keyFormat = Encoding.HEX
): PublicKey<Curve> {
  const data = encodeBytes(key, keyFormat);
  return {
    data,
    curve,
    format: (fmt: Encoding) => formatBytes(data, fmt),
  };
}

export function skFromString<Curve>(
  key: string,
  curve: Curve,
  keyFormat = Encoding.HEX
): SecretKey<Curve> {
  const data = encodeBytes(key, keyFormat);
  return {
    data,
    curve,
    format: (fmt: Encoding) => formatBytes(data, fmt),
  };
}
