import { PublicKey, SecretKey } from '@baf-wallet/interfaces';

export function formatKey(key: PublicKey | SecretKey) {
  return Buffer.from(key).toString('hex');
}
