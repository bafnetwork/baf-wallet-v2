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
import { discordWithdrawStuff } from '../service/discord';

@Route('discord')
export class UsersController extends Controller {
  @SuccessResponse('204')
  @Post('widthdraw')
  public async getUser(): Promise<void> {
    discordWithdrawStuff()
  }
}
