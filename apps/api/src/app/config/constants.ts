import { Env } from '@baf-wallet/interfaces';
import { NearInitParams, getNearNetworkID } from '@baf-wallet/near';
import { environment, initDotEnv } from '../../environments/environment';

initDotEnv();

export const constants = {
  chainParams: {
    near: {
      keyPath: process.env.NEAR_KEYPATH,
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
