import { Env } from '@baf-wallet/interfaces';
import { config as dotenvConfig } from 'dotenv';

export function initDotEnv() {
  if (!process.env.NON_LOCAL)
    dotenvConfig({ path: './apps/api/src/environments/.env.test' });
}

export const environment = {
  env: Env.TEST,
  production: false,
};
