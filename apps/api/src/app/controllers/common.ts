import { PublicKey } from '@baf-wallet/interfaces';
import Torus from '@toruslabs/torus.js';
import NodeDetailsManager from '@toruslabs/fetch-node-details';
import { constants } from '../config/constants';
import * as fetch from 'node-fetch';
import { secp256k1 } from '@baf-wallet/multi-chain';

export type hexString = string;

export async function getPublicAddress(
  userId: string,
  verifierName: string
): Promise<PublicKey> {
  const torus = new Torus();
  console.log(constants.torus.network, userId);
  const nodeManager = new NodeDetailsManager({
    network: constants.torus.network,
    proxyAddress: constants.torus.proxyAddress,
  });

  const {
    torusNodeEndpoints,
    torusNodePub,
    torusIndexes,
  } = await nodeManager.getNodeDetails();

  console.log(userId, torusNodePub, torusNodeEndpoints);

  (global as any).fetch = fetch;
  const torusPublicKey = await torus.getPublicAddress(
    [
      'https://teal-15-1.torusnode.com/jrpc',
      'https://teal-15-3.torusnode.com/jrpc',
      'https://teal-15-4.torusnode.com/jrpc',
      'https://teal-15-5.torusnode.com/jrpc',
      'https://teal-15-2.torusnode.com/jrpc',
    ],
    [
      {
        X: '1363aad8868cacd7f8946c590325cd463106fb3731f08811ab4302d2deae35c3',
        Y: 'd77eebe5cdf466b475ec892d5b4cffbe0c1670525debbd97eee6dae2f87a7cbe',
      },
      {
        X: '7c8cc521c48690f016bea593f67f88ad24f447dd6c31bbab541e59e207bf029d',
        Y: 'b359f0a82608db2e06b953b36d0c9a473a00458117ca32a5b0f4563a7d539636',
      },
      {
        X: '8a86543ca17df5687719e2549caa024cf17fe0361e119e741eaee668f8dd0a6f',
        Y: '9cdb254ff915a76950d6d13d78ef054d5d0dc34e2908c00bb009a6e4da701891',
      },
      {
        X: '25a98d9ae006aed1d77e81d58be8f67193d13d01a9888e2923841894f4b0bf9c',
        Y: 'f63d40df480dacf68922004ed36dbab9e2969181b047730a5ce0797fb6958249',
      },
      {
        X: 'd908f41f8e06324a8a7abcf702adb6a273ce3ae63d86a3d22723e1bbf1438c9a',
        Y: 'f977530b3ec0e525438c72d1e768380cbc5fb3b38a760ee925053b2e169428ce',
      },
    ],
    { verifier: 'baf wallet-discord-testnet', verifierId: userId },
    true
  );
  console.log(torusPublicKey);

  const pub = { x: (torusPublicKey as any).X, y: (torusPublicKey as any).Y };
  const key = secp256k1.keyFromPublic(pub, 'hex');
  console.log(key.getPublic().encode('hex', false));
  return Buffer.from(key.getPublic('hex'), 'hex');
}
