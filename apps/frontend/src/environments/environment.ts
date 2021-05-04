import { Env } from '@baf-wallet/interfaces';

export const environment = {
  production: false,
  env: Env.DEV,
  baseUrl: process.env.BASE_URL
    ? process.env.BASE_URL
    : 'http://localhost:8080',
  basePathApi: 'http://localhost:3333',
};
