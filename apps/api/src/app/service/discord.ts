import FormData from 'form-data';
import axios from 'axios';
import { constants } from '../config/constants';
import { CryptoCurves } from '@baf-wallet/interfaces';

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

// TODO: spec out
export async function getPubkeyForUser(
  username: string,
  tag: number
): Promise<string> {
  // check tag to make sure it is a 4-digit number, return a helpful error if it isn't
  // try to get the user info object from the discord api, return a helpful error if it DNE
  // use torus's `getPublicAddress` method to get the pubkey given the user ID
  return 'unimplemented';
}
