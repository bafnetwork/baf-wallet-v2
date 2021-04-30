import { Env } from '@baf-wallet/interfaces';
import { config as dotenvConfig } from 'dotenv';

export function initDotEnv() {
  if (process.env.LOCAL)
    dotenvConfig({ path: './apps/api/src/environments/.env.prod' });
}

export const environment = {
  env: Env.DEV,
  production: true,
};
