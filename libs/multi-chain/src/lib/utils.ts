import {
  Balance,
  ChainAccount,
  ChainName,
  KeyFormats,
  PublicKey,
  SecretKey,
} from '@baf-wallet/interfaces';
import { Account as NearNativeAccount } from 'near-api-js';
import * as bs58 from 'bs58';

export function formatKey(
  key: PublicKey | SecretKey,
  keyFormat = KeyFormats.hex
) {
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

export async function getAccountBalance(
  chain: ChainName,
  account: ChainAccount
): Promise<Balance> {
  switch (chain) {
    case ChainName.NEAR:
      const bal = await (account as NearNativeAccount).getAccountBalance();
      return bal.total;
    default:
      throw 'Chain not supported';
  }
}
