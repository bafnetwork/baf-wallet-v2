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
import { CryptoCurves, PublicKey } from '@baf-wallet/interfaces';
import { ec, eddsa } from 'elliptic';

interface CreateNearAccountParams {
  discordUserId: string;
  nonce: string;
  secpSig: ec.Signature;
  edPubkey: PublicKey;
  edSig: eddsa.Signature;
}

@Route('near')
export class NearController extends Controller {
  @SuccessResponse('204')
  @Post('account')
  public async createNearAccount(
    @Body() requestBody: CreateNearAccountParams
  ): Promise<void> {
    const secpPubkey = Buffer.from(
      '60cf347dbc59d31c1358c8e5cf5e45b822ab85b79cb32a9f3d98184779a9efc2',
      'hex'
    ); // TODO: derive from torus

    await createNearAccount(
      secpPubkey,
      requestBody.edPubkey,
      requestBody.discordUserId,
      requestBody.nonce,
      requestBody.secpSig,
      requestBody.edSig,
      CryptoCurves.secp256k1
    );
  }
}
