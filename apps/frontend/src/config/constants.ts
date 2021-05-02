import { Env } from '@baf-wallet/interfaces';
import { environment } from '../environments/environment';
import { TORUS_NETWORK_TYPE } from '@toruslabs/torus-direct-web-sdk';

console.log(environment)
export const constants = {
  env: environment.env,
  baseUrl: environment.baseUrl,
  basePathApi: environment.basePathApi,
  torus: {
    network: (environment.env === Env.PROD
      ? 'mainnet'
      : 'testnet') as TORUS_NETWORK_TYPE,
    discord: {
      verifier: 'baf wallet-discord-testnet',
      clientId: '821890148198776874',
    },
  },
};
