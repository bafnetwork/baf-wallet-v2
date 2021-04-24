import { Encoding, PublicKey, SecretKey } from '@baf-wallet/interfaces';
import * as bs58 from 'bs58';

export function formatBytes(buf: Buffer, fmt = Encoding.hexs) {
  switch (fmt) {
    case Encoding.hex:
      return Buffer.from(buf).toString('hex');
    case Encoding.bs58:
      return bs58.encode(Buffer.from(buf));
  }
}

export function encodeBytes(str: string, fmt: Encoding): Buffer {
  switch (fmt) {
    case Encoding.hex:
      return Buffer.from(str, 'hex');
    case Encoding.bs58:
      return bs58.encode(str);
  }
}

export function pkFromString<Curve>(
  key: string,
  curve: Curve,
  keyFormat = Encoding.hex
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
  keyFormat = Encoding.hex
): SecretKey<Curve> {
  const data = encodeBytes(key, keyFormat);
  return {
    data,
    curve,
    format: (fmt: Encoding) => formatBytes(data, fmt),
  };
}
