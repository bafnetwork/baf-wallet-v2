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
  getAccountNonce,
  NearAccountInfo,
} from '../service/near';
import { ed25519Marker, Encoding, PublicKey, secp256k1Marker } from '@baf-wallet/interfaces';
import { getTorusPublicAddress } from '@baf-wallet/torus';
import { constants } from '../config/constants';
import { hexString } from './common';
import { pkFromString } from '@baf-wallet/utils';

interface CreateNearAccountParams {
  userID: string;
  nonce: hexString;
  secpSigHex: hexString;
  secpSig_s: hexString;
  edPubkey: hexString;
  edSigHex: hexString;
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
      'discord'
    );

    await createNearAccount(
      secpPubkey,
      pkFromString(requestBody.edPubkey, ed25519Marker, Encoding.HEX),
      requestBody.userID,
      requestBody.nonce,
      requestBody.secpSigHex,
      requestBody.secpSig_s,
      requestBody.edSigHex,
      requestBody.accountID
    );
  }

  @SuccessResponse('200')
  @Get('account/{secpPubkeyB58}/nonce')
  public async getAccountNonce(@Path() secpPubkeyB58: string): Promise<string> {
    const pk = pkFromString(secpPubkeyB58, secp256k1Marker, Encoding.BS58);
    return await getAccountNonce(pk);
  }

  @SuccessResponse('200')
  @Get('account/{secpPubkeyB58}/id')
  public async getAccountInfo(@Path() secpPubkeyB58: string): Promise<NearAccountInfo> {
    const pk = pkFromString(secpPubkeyB58, secp256k1Marker, Encoding.BS58);
    return await getAccountInfoFromSecpPK(pk);
  }
}
