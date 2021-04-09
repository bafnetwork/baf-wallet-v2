import { ChainUtil } from './base-classes';
import { ec } from 'elliptic';
import * as sha3 from 'js-sha3';
const ecSecp = new ec('secp256k1');

const alicePriv = Buffer.from(
  '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  'hex'
);
const alicePub = Buffer.from(
  '034646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8fff',
  'hex'
);

const bobPub = Buffer.from(
  '03e276f53b2b0f3fc3d444110e7f8a0ea4c9fa1420fdf4994ae82c52338a7fd8d0',
  'hex'
)

const bobPriv = Buffer.from(
  '5688edde074e1aa602634bf4552413c82693e3ee74a7ace926afe67f695f67c8',
  'hex'
)
describe('Test the base classes core functionality', () => {
  describe('test chain utils', () => {
    it('test signing verification', () => {
      let msg = 'Message for signing';
      let msgHash = sha3.keccak256(msg);
      
      let signature = ecSecp.sign(msgHash, alicePriv, 'hex', {
        canonical: true,
      });

      expect(ChainUtil.verifySignedSecp256k1(alicePub, msg, signature)).toEqual(true)
    });
    it('test failed signing verification', () => {
      let msg = 'Message for signing';
      let msgHash = sha3.keccak256(msg);
      
      let signature = ecSecp.sign(msgHash, bobPriv, 'hex', {
        canonical: true,
      });

      expect(ChainUtil.verifySignedSecp256k1(alicePub, msg, signature)).toEqual(false)
    });
  });
});
