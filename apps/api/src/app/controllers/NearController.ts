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

import {
  createNearAccount,
  getAccountInfoFromSecpPK,
  getAccountNonceFromSecpPK,
} from '../service/near';
import { CryptoCurves, KeyFormats, PublicKey } from '@baf-wallet/interfaces';
import { constants } from '../config/constants';
import { hexString } from './common';
import { keyFromString } from '@baf-wallet/multi-chain';
import { getTorusPublicAddress } from '@baf-wallet/torus';

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
    const secpPubkey = await getTorusPublicAddress(
      requestBody.userID,
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

  @SuccessResponse('200')
  @Get('account/{secpPubkeyB58}/nonce')
  public async getAccountNonce(@Path() secpPubkeyB58: string): Promise<string> {
    const pk = keyFromString(secpPubkeyB58, KeyFormats.BS58);
    return await getAccountNonceFromSecpPK(pk);
  }

  @SuccessResponse('200')
  @Get('account/{secpPubkeyB58}/id')
  public async getAccountInfo(@Path() secpPubkeyB58: string) {
    const pk = keyFromString(secpPubkeyB58, KeyFormats.BS58);
    return await getAccountInfoFromSecpPK(pk);
  }
}
