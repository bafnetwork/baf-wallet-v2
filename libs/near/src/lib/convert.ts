import {
  Converter,
  KeyPair,
  PublicKey,
  Encoding,
} from '@baf-wallet/interfaces';
import { KeyPair as NearKeyPair, utils as NearUtils } from 'near-api-js';
import { bufferConverter, encodeBytes, formatBytes } from '@baf-wallet/utils';
import { Buffer } from 'buffer';
import { BafError } from '@baf-wallet/errors';

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
      throw BafError.UnsupportedKeyCurve('ed25519')
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
      throw BafError.UnsupportedKeyCurve('ed25519')
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
