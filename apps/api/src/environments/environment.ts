import { Env } from '@baf-wallet/interfaces';
import { config as dotenvConfig } from 'dotenv';

export function initDotEnv() {
  if (!process.env.NON_LOCAL)
    dotenvConfig({ path: './env/.env.dev' });
}

export const environment = {
  env: Env.DEV,
  production: false,
};
