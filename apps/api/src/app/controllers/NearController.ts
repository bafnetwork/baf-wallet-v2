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
import { CryptoCurves, KeyFormats, PublicKey } from '@baf-wallet/interfaces';
import { getPublicAddress } from './common';
import { constants } from '../config/constants';
import { hexString } from './common';
import { keyFromString } from '@baf-wallet/multi-chain';

interface CreateNearAccountParams {
  userID: string;
  nonce: hexString;
  secpSig: hexString;
  secpSig_s: hexString;
  edPubkey: hexString;
  edSig: hexString;
  accountID: string;
}

@Route('near')
export class NearController extends Controller {
  @SuccessResponse('204')
  @Post('account')
  public async createNearAccount(
    @Body() requestBody: CreateNearAccountParams
  ): Promise<void> {
    const secpPubkey = await getPublicAddress(
      requestBody.userID,
      constants.torus.verifierName
    );

    await createNearAccount(
      secpPubkey,
      keyFromString(requestBody.edPubkey, KeyFormats.HEX),
      requestBody.userID,
      requestBody.nonce,
      requestBody.secpSig,
      requestBody.secpSig_s,
      requestBody.edSig,
      requestBody.accountID,
      CryptoCurves.secp256k1
    );
  }
}
