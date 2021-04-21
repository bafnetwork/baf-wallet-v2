import { ChainUtil } from './base-classes';
import {edPubkeyFromSK, edSKFromSeed, secpPubkeyFromSK, secpSKFromSeed} from '../crypto'
import { ec, eddsa } from 'elliptic';
import * as sha3 from 'js-sha3';
const ecSecp = new ec('secp256k1');
const ecEd = new eddsa('ed25519');

// TODO: fix!!!!const seed = new Uint8Array(
const seed = new Uint8Array(
  Buffer.from(
    'af4391c50ca34de55165ffbfcd9e43a846a37ef97905988b694ba886d23c05d5',
    'hex'
  )
);

const seed_2 = new Uint8Array(
  Buffer.from(
    'af4391c10ca34de55165ffbfcd9e43a846a37ef97905988b694ba886d23c05d5',
    'hex'
  )
);

const bobEdSecretKey = edSKFromSeed(seed_2);
const bobSecpSecretKey = secpSKFromSeed(seed_2);

const aliceEdSecretKey = edSKFromSeed(seed);
const aliceSecpSecretKey = secpSKFromSeed(seed);

const aliceEdPublicKey = edPubkeyFromSK(aliceEdSecretKey);
const aliceSecpPublicKey = secpPubkeyFromSK(aliceSecpSecretKey);

describe('Test the base classes core functionality', () => {
  describe('test chain utils', () => {
    it('test signing verification Secp', () => {
      let msg = 'Message for signing';
      let msgHash = sha3.keccak256(msg);

      let signature = ecSecp.sign(msgHash, aliceSecpSecretKey, 'hex', {
        canonical: true,
      });

      expect(
        ChainUtil.verifySignedSecp256k1(
          aliceSecpPublicKey,
          msg,
          signature.toDER('hex')
        )
      ).toEqual(true);
    });
    it('test failed signing verification Secp', () => {
      let msg = 'Message for signing';
      let msgHash = sha3.keccak256(msg);

      let signature = ecSecp.sign(msgHash, bobSecpSecretKey, 'hex', {
        canonical: true,
      });

      expect(
        ChainUtil.verifySignedSecp256k1(
          aliceSecpPublicKey,
          msg,
          signature.toDER('hex')
        )
      ).toEqual(false);
    });
    it('test signing verification Ed', () => {
      let msg = 'Message for signing';

      let signature = ChainUtil.signEd25519(aliceEdSecretKey, msg);

      expect(ChainUtil.verifySignedEd25519(aliceEdPublicKey, msg, signature)).toEqual(
        true
      );
    });
    it('test failed signing verification Ed', () => {
      let msg = 'Message for signing';
      let msgHash = sha3.keccak256(msg);

      let signature = ChainUtil.signEd25519(bobEdSecretKey, msgHash);

      expect(ChainUtil.verifySignedEd25519(aliceEdPublicKey, msg, signature)).toEqual(
        false
      );
    });
  });
});
