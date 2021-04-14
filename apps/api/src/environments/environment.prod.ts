import { Envs } from '@baf-wallet/interfaces';
import { config as dotenvConfig } from 'dotenv';

export function initDotEnv() {
  dotenvConfig({ path: './apps/api/src/environments/.env.prod' });
}

export const environment = {
  env: Envs.DEV,
  production: true,
};
