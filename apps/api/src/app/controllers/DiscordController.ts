import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Route,
  SuccessResponse,
} from 'tsoa';
import { getPubkeyForUser } from '../service/discord';

interface GetPubkeyForUserParams {
  username: string;
  tag: number;
}

@Route('discord')
export class UsersController extends Controller {
  @SuccessResponse('204')
  @Post('getPubkeyForUser')
  public async getPubkeyForUser(
    @Body() requestBody: GetPubkeyForUserParams
  ): Promise<string> {
    const { username, tag } = requestBody;
    return getPubkeyForUser(username, tag);
  }
}
