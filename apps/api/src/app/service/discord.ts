import FormData from 'form-data';
import axios from 'axios';
import { constants } from '../config/constants';
import * as discord from 'discord.js';

export interface DiscordPublicInfo {
  verifierId: string;
}

export async function discordRevokeAccessToken(token: string) {
  const formData = new FormData();
  formData.append('token', token);
  const res = await axios.post(
    'https://discordapp.com/api/oauth2/token/revoke',
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Basic ${Buffer.from(
          `${constants.discord.clientId}:${constants.discord.clientSecret}`,
          'binary'
        ).toString('base64')}`,
      },
    }
  );
}
