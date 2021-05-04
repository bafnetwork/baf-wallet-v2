import * as dotenv from 'dotenv';

if (!process.env.NON_LOCAL)
  dotenv.config({ path: './apps/bot/src/environments/.env' });

export const environment = {
  production: true,
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
};
