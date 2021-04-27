import { Env } from '@baf-wallet/interfaces';
import { config as dotenvConfig } from 'dotenv';

export function initDotEnv() {
  dotenvConfig({ path: './apps/api/src/environments/.env.dev' });
}

export const environment = {
  env: Env.DEV,
  production: false,
};
