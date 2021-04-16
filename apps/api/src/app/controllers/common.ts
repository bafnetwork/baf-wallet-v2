import {PublicKey} from '@baf-wallet/interfaces'

/**
 * PublicKeyWrapper is intended to be used for API specs as TSOA, the automatic
 * swagger docs generator, does not recognize the type declaration
 */
export interface PublicKeyWrapper {
  pk: Buffer;
}
