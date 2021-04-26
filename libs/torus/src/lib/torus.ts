import DirectWebSdk, { TorusLoginResponse } from '@toruslabs/torus-direct-web-sdk';
import { PublicKey } from '@baf-wallet/interfaces';
import Torus from '@toruslabs/torus.js';
import NodeDetailsManager from '@toruslabs/fetch-node-details';
import * as fetch from 'node-fetch';
import { secp256k1 } from '@baf-wallet/multi-chain';
import { torusConstants } from './constants';

const torus = new Torus({
  metadataHost: 'https://metadata.tor.us',
  allowHost: 'https://signer.tor.us/api/allow',
});
Torus.setAPIKey('torus-default');

export async function getTorusPublicAddress(
  userId: string
): Promise<PublicKey> {
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
    { verifier: torusConstants.verifier, verifierId: userId },
    true
  );

  const pub = { x: (torusPublicKey as any).X, y: (torusPublicKey as any).Y };
  const key = secp256k1.keyFromPublic(pub, 'hex');
  return Buffer.from(key.getPublic('hex'), 'hex');
}

export async function buildTorusWebSdk(baseUrl): Promise<DirectWebSdk> {
  const torus = new DirectWebSdk({
    baseUrl,
    network: 'testnet', // details for test net, TODO: ropsten
    proxyContractAddress: '0x4023d2a0D330bF11426B12C6144Cfb96B7fa6183',
  });
  await torus.init();
  return torus;
}

export async function triggerLogin(
  torus: DirectWebSdk,
  typeOfLogin = 'discord'
) : Promise<TorusLoginResponse> {
  return await torus.triggerLogin({
    typeOfLogin: 'discord',
    verifier: torusConstants.discord.verifier,
    clientId: torusConstants.discord.clientId,
  });
}
