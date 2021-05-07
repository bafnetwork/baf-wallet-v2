import { Encoding, PublicKey, SecretKey } from '@baf-wallet/interfaces';
import { BafError } from '@baf-wallet/errors';
import * as bs58 from 'bs58';

export function formatBytes(buf: Buffer, fmt = Encoding.HEX) {
  switch (fmt) {
    case Encoding.HEX:
      return Buffer.from(buf).toString('hex');
    case Encoding.BS58:
      return bs58.encode(Buffer.from(buf));
    default:
      throw BafError.UnsupportedEncoding(fmt);
  }
}

export function encodeBytes(str: string, fmt: Encoding): Buffer {
  switch (fmt) {
    case Encoding.HEX:
      return Buffer.from(str, 'hex');
    case Encoding.BS58:
      return bs58.decode(str);
    case Encoding.UTF8:
      return Buffer.from(str, 'utf8');
    default:
      throw BafError.UnsupportedEncoding(fmt);
  }
}
