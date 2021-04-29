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
  getPublicInfoForUserId,
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

  @SuccessResponse('200')
  @Get('public-info/{userId}')
  public async getPublicInfoForUser(
    @Path() userId: string
  ): Promise<DiscordPublicInfo> {
    return getPublicInfoForUserId(userId);
  }
}
