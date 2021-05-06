import { Env } from '@baf-wallet/interfaces';
import { config as dotenvConfig } from 'dotenv';

export function initDotEnv() {
  if (!process.env.NON_LOCAL) dotenvConfig({ path: './env/.env.test' });
}

export const environment = {
  env: Env.TEST,
  production: false,
};
