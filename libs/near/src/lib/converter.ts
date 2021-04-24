import { 
  ChainInterface,
  ChainSpecificInterface, 
  AccountsInterface, 
  RpcInterface, 
  TxInterface, 
  Converter,
  KeyPair,
  SecretKey,
  PublicKey,
  secp256k1,
  ed25519,
  Encoding
} from '@baf-wallet/interfaces';
import { KeyPair as NearKeyPair } from 'near-api-js';
import { bufferConverter, encodeBytes, formatBytes } from '@baf-wallet/utils'
import { Buffer } from 'buffer';

const NearConverter: Converter = {
    ...bufferConverter,
    keyPairToBaf<Curve>(keyPair: NearKeyPair, curveMarker: Curve): KeyPair<Curve> {
        const skFmt = keyPair.toString();
        if (!skFmt.startsWith(curveMarker.toString())) {
            throw new Error('keyPair is on the wrong curve! Please specify the other curve');
        }

        const skStr = skFmt.split(':')[1];
        const skData = encodeBytes(skStr, Encoding.bs58);
        const pkData = Buffer.from(keyPair.getPublicKey().data);

        return {
            curve: curveMarker,
            pk: {
                curve: curveMarker,
                data: pkData,
                format: (fmt: Encoding) => formatBytes(pkData, fmt)
            },
            sk: {
                curve: curveMarker,
                data: skData,
                format: (fmt: Encoding) => formatBytes(skData, fmt)
            }
        }
    },
    keyPairFromBaf<Curve>(bafKeyPair: KeyPair<Curve>): NearKeyPair {
        const prefix = bafKeyPair.curve.toString();
        const skStr = bafKeyPair.sk.format(Encoding.bs58);
        return NearKeyPair.fromString(`${prefix}:${skStr}`);
    }
}