import { Envs, getNearNetworkId } from '@baf-wallet/interfaces';
import { environment, initDotEnv } from '../../environments/environment';

initDotEnv();

export const constants = {
  nearAccountConfig: {
    keyPath: process.env.NEAR_KEYPATH,
    networkId: getNearNetworkId(environment.env),
    masterAccountId: process.env.NEAR_MASTER_ACCOUNT_ID,
  },
  discord: {
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
  },
  torus: {
    verifierName: 'discord',
    network: environment.env === Envs.PROD ? 'mainnet' : 'testnet',
    proxyAddress: '0x4023d2a0D330bF11426B12C6144Cfb96B7fa6183',
  },
};
