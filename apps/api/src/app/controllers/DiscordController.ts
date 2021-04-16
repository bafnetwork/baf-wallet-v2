import {
  Body,
  Controller,
  Post,
  Route,
  SuccessResponse,
} from 'tsoa';
import {
  discordRevokeAccessToken,
} from '../service/discord';

interface IRevokeToken {
  token: string;
}

@Route('discord')
export class DiscordController extends Controller {
  @SuccessResponse('204')
  @Post('revoke-token')
  public async revokeToken(@Body() accessToken: IRevokeToken): Promise<void> {
    await discordRevokeAccessToken(accessToken.token);
  }
}
