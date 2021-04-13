import { ChainUtil } from './base-classes';
import { ec, eddsa } from 'elliptic';
import * as sha3 from 'js-sha3';
const ecSecp = new ec('secp256k1');
const ecEd = new eddsa('ed25519');

const alicePubEd = Buffer.from(
  '207a067892821e25d770f1fba0c47c11ff4b813e54162ece9eb839e076231ab6',
  'hex'
);

const alicePriv = Buffer.from(
  '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  'hex'
);
const alicePubSec = Buffer.from(
  '034646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8fff',
  'hex'
);

const bobPubEd = Buffer.from(
  'aa0440da6f61aa9832d0ab0ff01e7779d6a35abf190e3602dc92deca918b1215',
  'hex'
);

const bobPubSec = Buffer.from(
  '03e276f53b2b0f3fc3d444110e7f8a0ea4c9fa1420fdf4994ae82c52338a7fd8d0',
  'hex'
);

const bobPrivSec = Buffer.from(
  '5688edde074e1aa602634bf4552413c82693e3ee74a7ace926afe67f695f67c8',
  'hex'
);
describe('Test the base classes core functionality', () => {
  describe('test chain utils', () => {
    it('test signing verification Secp', () => {
      let msg = 'Message for signing';
      let msgHash = sha3.keccak256(msg);

      let signature = ecSecp.sign(msgHash, alicePriv, 'hex', {
        canonical: true,
      });

      expect(
        ChainUtil.verifySignedSecp256k1(alicePubSec, msg, signature)
      ).toEqual(true);
    });
    it('test failed signing verification Secp', () => {
      let msg = 'Message for signing';
      let msgHash = sha3.keccak256(msg);

      let signature = ecSecp.sign(msgHash, bobPrivSec, 'hex', {
        canonical: true,
      });

      expect(
        ChainUtil.verifySignedSecp256k1(alicePubSec, msg, signature)
      ).toEqual(false);
    });
    it('test signing verification Ed', () => {
      let msg = 'Message for signing';
      let msgHash = sha3.keccak256(msg);

      let signature = ecEd.sign(msgHash, alicePriv);

      expect(ChainUtil.verifySignedEd25519(alicePubEd, msg, signature)).toEqual(
        true
      );
    });
    it('test failed signing verification Ed', () => {
      let msg = 'Message for signing';
      let msgHash = sha3.keccak256(msg);

      let signature = ecEd.sign(msgHash, bobPrivSec);

      expect(ChainUtil.verifySignedEd25519(alicePubEd, msg, signature)).toEqual(
        false
      );
    });
  });
});
