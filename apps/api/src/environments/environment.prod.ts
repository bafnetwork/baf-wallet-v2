import { Env } from '@baf-wallet/interfaces';
import { config as dotenvConfig } from 'dotenv';

export function initDotEnv() {
  if (!process.env.NON_LOCAL) dotenvConfig({ path: './env/.env.prod' });
}

export const environment = {
  env: Env.PROD,
  production: true,
};
