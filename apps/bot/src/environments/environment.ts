import * as dotenv from 'dotenv';

dotenv.config({ path: './apps/bot/src/environments/.env.dev' });

export const environment = {
  production: false,
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  BASE_WALLET_URL: process.env.BASE_WALLET_URL ?? 'https://localhost:4200',
};
