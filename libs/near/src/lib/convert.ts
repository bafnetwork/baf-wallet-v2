import {
  ChainInterface,
  AccountsInterface,
  RpcInterface,
  TxInterface,
  Converter,
  KeyPair,
  SecretKey,
  PublicKey,
  secp256k1,
  ed25519,
  Encoding,
} from '@baf-wallet/interfaces';
import { KeyPair as NearKeyPair, utils as NearUtils } from 'near-api-js';
import { bufferConverter, encodeBytes, formatBytes } from '@baf-wallet/utils';
import { Buffer } from 'buffer';

export const nearConverter: Converter<
  NearUtils.PublicKey,
  Buffer,
  NearKeyPair
> = {
  ...bufferConverter,

  pkToUnified<Curve>(
    pk: NearUtils.PublicKey,
    curveMarker: Curve
  ): PublicKey<Curve> {
    if (curveMarker.toString() !== 'ed25519') {
      throw new Error(
        'currently this function only supports ! Please specify the correct curve marker'
      );
    }
    const data = Buffer.from(pk.data);
    return {
      curve: curveMarker,
      data: data,
      format: (fmt: Encoding) => formatBytes(data, fmt),
    };
  },

  pkFromUnified: <Curve>(unifiedPk: PublicKey<Curve>): NearUtils.PublicKey =>
    NearUtils.PublicKey.fromString(unifiedPk.format(Encoding.BS58)),

  keyPairToUnified<Curve>(
    keyPair: NearKeyPair,
    curveMarker: Curve
  ): KeyPair<Curve> {
    const skFmt = keyPair.toString();
    if (!skFmt.startsWith(curveMarker.toString())) {
      throw new Error(
        'keyPair is on the wrong curve! Please specify the correct curve in the type argument'
      );
    }

    const skStr = skFmt.split(':')[1];
    const skData = encodeBytes(skStr, Encoding.BS58);
    const pkData = Buffer.from(keyPair.getPublicKey().data);

    return {
      curve: curveMarker,
      pk: {
        curve: curveMarker,
        data: pkData,
        format: (fmt: Encoding) => formatBytes(pkData, fmt),
      },
      sk: {
        curve: curveMarker,
        data: skData,
        format: (fmt: Encoding) => formatBytes(skData, fmt),
      },
    };
  },

  keyPairFromUnified<Curve>(unifiedKeyPair: KeyPair<Curve>): NearKeyPair {
    const prefix = unifiedKeyPair.curve.toString();
    const skStr = unifiedKeyPair.sk.format(Encoding.BS58);
    return NearKeyPair.fromString(`${prefix}:${skStr}`);
  },
};
