import * as dotenv from 'dotenv';

if (!process.env.NON_LOCAL)
  dotenv.config({ path: './env/.env.prod' });

export const environment = {
  production: true,
  DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
};
