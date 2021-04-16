import FormData from 'form-data';
import axios from 'axios';
import { constants } from '../config/constants';

export async function discordRevokeAccessToken(token: string) {
  const formData = new FormData();
  formData.append('token', token);
  await axios.post('https://discordapp.com/api/oauth2/token/revoke', formData, {
    headers: {
      ...formData.getHeaders(),
      Authorization: `Basic ${Buffer.from(
        `${constants.discord.clientId}:${constants.discord.clientSecret}`,
        'binary'
      ).toString('base64')}`,
    },
  });
}
