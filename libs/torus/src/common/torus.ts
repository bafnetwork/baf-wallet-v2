import { PublicKey } from '@baf-wallet/interfaces';
import Torus from '@toruslabs/torus.js';
import NodeDetailsManager from '@toruslabs/fetch-node-details';
import * as fetch from 'node-fetch';
import { secp256k1 } from '@baf-wallet/multi-chain';
import { torusConstants, TORUS_LOGIN_TYPE } from './constants';

const torus = new Torus({
  metadataHost: 'https://metadata.tor.us',
  allowHost: 'https://signer.tor.us/api/allow',
});
Torus.setAPIKey('torus-default');

export async function getTorusPublicAddress(
  userId: string,
  loginType: TORUS_LOGIN_TYPE
): Promise<PublicKey> {
  assertLoginTypeRegistered(loginType)
  // Configuration from https://github.com/torusresearch/torus-direct-web-sdk/blob/master/src/login.ts
  const nodeManager = new NodeDetailsManager({
    network: torusConstants.network,
    proxyAddress: torusConstants.proxyAddress,
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
    { verifier: torusConstants.verifierInfo[loginType].verifier, verifierId: userId },
    true
  );

  const pub = { x: (torusPublicKey as any).X, y: (torusPublicKey as any).Y };
  const key = secp256k1.keyFromPublic(pub, 'hex');
  return Buffer.from(key.getPublic('hex'), 'hex');
}

export function assertLoginTypeRegistered(loginType: TORUS_LOGIN_TYPE): boolean {
  if (!torusConstants.verifierInfo[loginType])
    throw `No verifier info exits for login type ${loginType}`
  return true
}