import { Envs } from '@baf-wallet/interfaces';

export const environment = {
  production: false,
  env: Envs.TEST,
  baseUrl: 'https://baf-wallet.netlify.app',
  // TODO: update
  basePathApi: 'http://localhost:3333',
};
