import { KeyFormats, PublicKey, SecretKey } from '@baf-wallet/interfaces';
import * as bs58 from 'bs58';

export function formatKey(
  key: PublicKey | SecretKey,
  keyFormat = KeyFormats.hex
): string {
  switch (keyFormat) {
    case KeyFormats.hex:
      return Buffer.from(key).toString('hex');
    case KeyFormats.bs58:
      return bs58.encode(Buffer.from(key));
  }
}

export function keyFromString(
  key: string,
  keyFormat = KeyFormats.hex
): PublicKey | SecretKey {
  switch (keyFormat) {
    case KeyFormats.hex:
      return Buffer.from(key, 'hex');
    case KeyFormats.bs58:
      return Buffer.from(bs58.decode(key));
  }
}
