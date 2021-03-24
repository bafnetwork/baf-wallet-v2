import * as dotenv from "dotenv";

dotenv.config();

export const environment = {
  production: true,
  DISCORD_TOKEN: process.env.DISCORD_TOKEN
};