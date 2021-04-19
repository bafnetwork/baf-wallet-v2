import { KeyFormats, PublicKey, SecretKey } from '@baf-wallet/interfaces';
import * as bs58 from 'bs58';

export function formatKey(
  key: PublicKey | SecretKey,
  keyFormat = KeyFormats.HEX
): string {
  switch (keyFormat) {
    case KeyFormats.HEX:
      return Buffer.from(key).toString('hex');
    case KeyFormats.BS58:
      return bs58.encode(Buffer.from(key));
    default:
      throw 'Invalid key format';
  }
}

export function formatKeyArray(key: PublicKey | SecretKey): number[] {
  return [...key];
}

export function keyFromString(
  key: string,
  keyFormat = KeyFormats.HEX
): PublicKey | SecretKey {
  switch (keyFormat) {
    case KeyFormats.HEX:
      return Buffer.from(key, 'hex');
    case KeyFormats.BS58:
      return Buffer.from(bs58.decode(key));
    default:
      throw 'Invalid key format';
  }
}
