import { PublicKey } from '@baf-wallet/interfaces';
import Torus from '@toruslabs/torus.js';
import NodeDetailsManager from '@toruslabs/fetch-node-details';

export type hexString = string;

export async function getPublicAddress(userId: string, verifierName: string): Promise<PublicKey> {
  const torus = new Torus({});
  const nodeManager = new NodeDetailsManager({
    network: 'ropsten',
    proxyAddress: '0x4023d2a0D330bF11426B12C6144Cfb96B7fa6183',
  });

  const {
    torusNodeEndpoints,
    torusNodePub,
    torusIndexes,
  } = await nodeManager.getNodeDetails();

  const torusPublicKey = await torus.getPublicAddress(
    torusNodeEndpoints,
    torusNodePub,
    { verifier: verifierName, verifierId: userId },
    true
  );

  console.log(torusPublicKey.toString());
  return Buffer.from(torusPublicKey.toString(), 'hex');  
}
