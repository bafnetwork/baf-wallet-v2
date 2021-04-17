import { getNearNetworkId } from '@baf-wallet/interfaces';
import { environment } from '../../environments/environment';

import { initDotEnv } from '../../environments/environment';
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
    verifierName: process.env.TORUS_VERIFIER_NAME,
    network: process.env.TORUS_NETWORK,
  }
};

console.log(constants);