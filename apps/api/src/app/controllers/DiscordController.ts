import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Route,
  SuccessResponse,
} from 'tsoa';
import {
  discordRevokeAccessToken,
  DiscordPublicInfo,
} from '../service/discord';

interface RevokeTokenParams {
  token: string;
}

@Route('discord')
export class DiscordController extends Controller {
  @SuccessResponse('204')
  @Post('revoke-token')
  public async revokeToken(
    @Body() accessToken: RevokeTokenParams
  ): Promise<void> {
    await discordRevokeAccessToken(accessToken.token);
  }
}
