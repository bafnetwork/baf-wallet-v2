import { Body, Controller, Post, Route, SuccessResponse } from 'tsoa';
import { getPubkeyForUser, discordRevokeAccessToken } from '../service/discord';

interface RevokeTokenParams {
  token: string;
}

interface GetPubkeyForUserParams {
  username: string;
  tag: number;
}

@Route('discord')
export class DiscordController extends Controller {
  @SuccessResponse('204')
  @Post('revoke-token')
  public async revokeToken(@Body() accessToken: RevokeTokenParams): Promise<void> {
    await discordRevokeAccessToken(accessToken.token);
  }

  @SuccessResponse('200')
  @Post('get-pubkey-for-user')
  public async getPubkeyForUser(
    @Body() requestBody: GetPubkeyForUserParams
  ): Promise<string> {
    const { username, tag } = requestBody;
    return getPubkeyForUser(username, tag);
  }
}
