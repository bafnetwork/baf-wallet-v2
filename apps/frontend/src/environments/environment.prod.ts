import { Env } from '@baf-wallet/interfaces';

export const environment = {
  production: true,
  env: Env.PROD,
  // TODO: update
  baseUrl: process.env.BASE_URL ? process.env.BASE_URL : '',
  basePathApi: 'http://localhost:3333',
};
