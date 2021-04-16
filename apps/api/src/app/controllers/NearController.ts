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
import { PublicKeyWrapper, getPublicAddress } from './common';
import { constants } from '../config/constants'

interface CreateNearAccountParams {
  userId: string;
  nonce: string;
  secpSig: ec.Signature;
  edPubkey: PublicKeyWrapper;
  edSig: eddsa.Signature;
}

@Route('near')
export class NearController extends Controller {
  @SuccessResponse('204')
  @Post('account')
  public async createNearAccount(
    @Body() requestBody: CreateNearAccountParams
  ): Promise<void> {
    const secpPubkey = await getPublicAddress(requestBody.userId, constants.torus.verifierName)

    console.log(secpPubkey);

    await createNearAccount(
      secpPubkey,
      requestBody.edPubkey.pk,
      requestBody.userId,
      requestBody.nonce,
      requestBody.secpSig,
      requestBody.edSig,
      CryptoCurves.secp256k1
    );
  }
}