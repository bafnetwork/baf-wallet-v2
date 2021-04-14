import { PublicKey, SecretKey } from '@baf-wallet/interfaces';
import { ec as EC } from 'elliptic';
import * as tweetnacl from 'tweetnacl';

const secp256k1 = new EC('secp256k1');

export function ed25519PubkeyFromSecret(secret: SecretKey): PublicKey {
  return Buffer.from(
    tweetnacl.sign.keyPair.fromSecretKey(new Uint8Array(secret)).publicKey
  );
}

export function secp256k1PubkeyFromSecret(secret: SecretKey): PublicKey {
  return Buffer.from(
    secp256k1.keyFromPrivate(secret).getPublic(true, 'hex'),
    'hex'
  );
}

export function secretFromSeed(seed: Uint8Array): SecretKey {
  return Buffer.from(
    tweetnacl.sign.keyPair.fromSeed(new Uint8Array(Buffer.from(seed))).secretKey
  );
}
