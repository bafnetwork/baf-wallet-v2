import { Env } from '@baf-wallet/interfaces';

export const environment = {
  production: false,
  env: Env.TEST,
  baseUrl: 'https://baf-wallet.netlify.app',
  // TODO: update
  basePathApi: 'https://baf-wallet-testnet.herokuapp.com',
};
