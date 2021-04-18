import { PublicKey, SecretKey } from '@baf-wallet/interfaces';
import { ec as EC, eddsa as EDDSA } from 'elliptic';
import * as nacl from 'tweetnacl';

export const secp256k1 = new EC('secp256k1');

export function edPubkeyFromSK(secret: SecretKey): PublicKey {
  return Buffer.from(
    nacl.sign.keyPair.fromSecretKey(new Uint8Array(secret)).publicKey
  );
}

export function secpPubkeyFromSK(secret: SecretKey): PublicKey {
  return Buffer.from(
    secp256k1.keyFromPrivate(secret).getPublic(true, 'hex'),
    'hex'
  );
}

export function edSKFromSeed(seed: Uint8Array): SecretKey {
  return Buffer.from(
    nacl.sign.keyPair.fromSeed(new Uint8Array(Buffer.from(seed))).secretKey
  );
}

export function secpSKFromSeed(seed: Uint8Array): SecretKey {
  const entropy = nacl.hash(seed);
  const sk = secp256k1.genKeyPair({ entropy }).getPrivate('hex');

  console.log(sk);

  return Buffer.from(sk, 'hex');
}

export function edSKFromRng(): SecretKey {
  return Buffer.from(nacl.sign.keyPair().secretKey);
}

export function secpSKFromRng(): SecretKey {
  return Buffer.from(secp256k1.genKeyPair().getPrivate('hex'), 'hex');
}
