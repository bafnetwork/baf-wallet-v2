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
import { ChainUtil } from '@baf-wallet/multi-chain';
import { ec } from 'elliptic';

interface CreateNearAccountParams {
  discordUser: string;
  nonce: string;
  signature: ec.Signature;
  derivedEd25519Pubkey: PublicKey;
}

@Route('near')
export class NearController extends Controller {
  @SuccessResponse('204')
  @Post('account')
  public async createNearAccount(
    @Body() requestBody: CreateNearAccountParams
  ): Promise<void> {
    const pubkey = Buffer.from(
      '60cf347dbc59d31c1358c8e5cf5e45b822ab85b79cb32a9f3d98184779a9efc2',
      'hex'
    ); // TODO: derive from torus
    const msg = ChainUtil.createUserVerifyMessage(
      requestBody.discordUser,
      requestBody.nonce
    );
    if (!ChainUtil.verifySignedSecp256k1(pubkey, msg, requestBody.signature)) {
      this.setStatus(403);
      throw 'Proof that the sender owns this public key must provided';
    }
    await createNearAccount(
      pubkey,
      requestBody.derivedEd25519Pubkey,
      CryptoCurves.secp256k1
    );
  }
}
