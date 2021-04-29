import { Encoding, PublicKey, secp256k1 } from '@baf-wallet/interfaces';
import Torus from '@toruslabs/torus.js';
import NodeDetailsManager from '@toruslabs/fetch-node-details';
import * as fetch from 'node-fetch';
import { torusConstants, TORUS_LOGIN_TYPE } from './constants';
import { pkSecpFromXY } from '@baf-wallet/multi-chain';

const torus = new Torus({
  metadataHost: 'https://metadata.tor.us',
  allowHost: 'https://signer.tor.us/api/allow',
});
Torus.setAPIKey('torus-default');

export async function getTorusPublicAddress(
  userId: string,
  loginType: TORUS_LOGIN_TYPE
): Promise<PublicKey<secp256k1>> {
  assertLoginTypeRegistered(loginType);
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
  console.log(torusNodeEndpoints, torusNodePub)
  const torusPublicKey = await torus.getPublicAddress(
    torusNodeEndpoints,
    torusNodePub,
    {
      verifier: torusConstants.verifierInfo[loginType].verifier,
      verifierId: userId,
    },
    true
  );

  return pkSecpFromXY((torusPublicKey as any).X, (torusPublicKey as any).Y);
}

export function assertLoginTypeRegistered(
  loginType: TORUS_LOGIN_TYPE
): boolean {
  if (!torusConstants.verifierInfo[loginType])
    throw `No verifier info exits for login type ${loginType}`;
  return true;
}
