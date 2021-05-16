import BN from 'bn.js';
import {
  Converter,
  SecretKey,
  PublicKey,
  Encoding,
  KeyPair,
  Pair,
} from '@baf-wallet/interfaces';
import { formatBytes } from './bytes';
import { Buffer } from 'buffer';

export const bufferConverter: Converter<
  Buffer,
  Buffer,
  Pair<Buffer, Buffer>
> = {
  skFromUnified,
  skToUnified,
  pkFromUnified,
  pkToUnified,
  keyPairFromUnified,
  keyPairToUnified,
};

function skFromUnified<Curve>(unifiedSk: SecretKey<Curve>): Buffer {
  return Buffer.from(unifiedSk.data);
}

function skToUnified<Curve>(sk: Buffer, curveMarker: Curve): SecretKey<Curve> {
  const data = Buffer.from(sk);
  return {
    data,
    curve: curveMarker,
    format: (fmt: Encoding) => formatBytes(data, fmt),
  };
}

function pkFromUnified<Curve>(bafPk: PublicKey<Curve>): Buffer {
  return Buffer.from(bafPk.data);
}

function pkToUnified<Curve>(pk: Buffer, curveMarker: Curve): PublicKey<Curve> {
  const data = Buffer.from(pk);
  return {
    data,
    curve: curveMarker,
    format: (fmt: Encoding) => formatBytes(data, fmt),
  };
}

function keyPairFromUnified<Curve>(
  unifiedKeyPair: KeyPair<Curve>
): Pair<Buffer, Buffer> {
  const { pk, sk } = unifiedKeyPair;
  return {
    fst: Buffer.from(sk.data),
    snd: Buffer.from(pk.data),
  };
}

function keyPairToUnified<Curve>(
  keyPair: Pair<Buffer, Buffer>,
  curveMarker: Curve
): KeyPair<Curve> {
  const skBytes = keyPair.fst;
  const pkBytes = keyPair.snd;
  return {
    curve: curveMarker,
    sk: skToUnified(skBytes, curveMarker),
    pk: pkToUnified(pkBytes, curveMarker),
  };
}

export function indivisibleToTokenAmount(
  indivisAmount: string | BN,
  decimals: number
): number {
  const base = new BN(10).pow(new BN(decimals));
  const div = new BN(indivisAmount).div(base);
  const mod = new BN(indivisAmount).mod(base);
  const valStr = `${div.toString(10)}.${mod.toString(10, decimals)}`;
  return parseFloat(valStr);
}

export function tokenAmountToIndivisible(
  amount: number,
  decimals: number
): string {
  const expStr = `${1}${new Array(decimals).fill('0').join('')}`;
  const exp = new BN(expStr);
  return exp.muln(amount).toString(10);
}
