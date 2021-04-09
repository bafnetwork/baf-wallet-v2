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

import { createNearAccount } from '../service/near';
import { CryptoCurves } from '@baf-wallet/interfaces';
import { ChainUtil } from '@baf-wallet/multi-chain';

interface CreateNearAccountParams {
  discordUser: string;
  privKey: string;
}

@Route('near')
export class NearController extends Controller {
  @SuccessResponse('204')
  @Post('account')
  public async createNearAccount(
    @Body() requestBody: CreateNearAccountParams
  ): Promise<void> {
    const pubkey =
      '60cf347dbc59d31c1358c8e5cf5e45b822ab85b79cb32a9f3d98184779a9efc2'; // TODO: derive from torus
    if (!ChainUtil.verifyKeypairSecp256k1(pubkey, requestBody.privKey)) {
      this.setStatus(403);
      throw 'Proof that the sender owns this public key must provided';
    }
    await createNearAccount(pubkey, CryptoCurves.secp256k1);
  }
}
