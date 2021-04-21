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
  console.log(constants.torus.network,)
  const nodeManager = new NodeDetailsManager({
    network: constants.torus.network,
  });

  const {
    torusNodeEndpoints,
    torusNodePub,
    torusIndexes,
  } = await nodeManager.getNodeDetails();

  (global as any).fetch = fetch;
  const torusPublicKey = await torus.getPublicAddress(
    torusNodeEndpoints,
    torusNodePub,
    { verifier: verifierName, verifierId: userId },
    true
  );
  console.log(torusPublicKey)

  const pub = { x: (torusPublicKey as any).X, y: (torusPublicKey as any).Y };
  const key = secp256k1.keyFromPublic(pub, 'hex');
  console.log(key.getPublic().encode('hex', true))
  return Buffer.from(key.getPublic('hex'), 'hex');
}
