import { ed25519, ed25519Marker, Encoding, Env } from '@baf-wallet/interfaces';
import { keyPairFromSk } from '@baf-wallet/multi-chain';
import { NearInitParams, getNearNetworkID } from '@baf-wallet/near';
import { skFromString } from '@baf-wallet/utils';
import { environment, initDotEnv } from '../../environments/environment';

initDotEnv();

export const constants = {
  chainParams: {
    near: {
      keyPair: keyPairFromSk<ed25519>(skFromString(process.env.NEAR_SK, ed25519Marker, Encoding.BS58)),
      networkID: getNearNetworkID(environment.env),
      masterAccountID: process.env.NEAR_MASTER_ACCOUNT_ID,
    } as NearInitParams,
  },
  discord: {
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
  },
  torus: {
    verifierName: 'discord',
    network: environment.env === Env.PROD ? 'mainnet' : 'testnet',
    proxyAddress: '0x4023d2a0D330bF11426B12C6144Cfb96B7fa6183',
  },
};
