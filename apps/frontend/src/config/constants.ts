import { Env } from '@baf-wallet/interfaces';
import { environment as env_dev } from '../environments/environment';
import { environment as env_test } from '../environments/environment.test';
import { environment as env_prod } from '../environments/environment.prod';
import { TORUS_NETWORK_TYPE } from '@toruslabs/torus-direct-web-sdk';

function getEnv() {
  switch(process.env.NODE_ENV) {
    case 'development':
      return env_dev;
    case 'test':
      return env_test;
    case 'production':
      return env_prod;
    default:
      return env_dev;
  }
}

const environment = getEnv();

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
