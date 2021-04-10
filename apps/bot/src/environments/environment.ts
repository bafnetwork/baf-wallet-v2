import * as dotenv from 'dotenv';

dotenv.config({ path: "./apps/bot/src/environments/dev/.env"});

export const environment = {
  production: false,
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
};
