import { KeySourceMethod, KeyPair, SupportedCurve, KeySource, KeySourceInitFn, secp256k1, PublicKey, SECP256K1_STR } from '@baf-wallet/interfaces';
import { skFromString } from '@baf-wallet/utils';
import { keyPairFromSk, skFromSeed } from '@baf-wallet/multi-chain';

import DirectWebSdk, { LOGIN_TYPE, DirectWebSDKArgs, TorusLoginResponse } from '@toruslabs/torus-direct-web-sdk';

export type OAuthDisplayName = string;
export interface TorusInitArgs {
  sdkArgs: DirectWebSDKArgs;
  oauthProvider: LOGIN_TYPE;
  torusVerifierName: string;
  oauthClientID: string;
  postLoginHook?: (userInfo: TorusLoginResponse) => Promise<void>;
}

export interface TorusKeySource extends KeySource<OAuthDisplayName> {
  method: KeySourceMethod.TORUS;
}

async function initTorus(params: DirectWebSDKArgs): Promise<DirectWebSdk> {
  const torus = new DirectWebSdk(params);
  await torus.init();
  return torus;
}

// extra unknown curve methods not necessary because with torus you can get whatever curve you want by using as seed
export const initTorusKeySource: KeySourceInitFn<OAuthDisplayName, TorusInitArgs> = async (params: TorusInitArgs): Promise<TorusKeySource> => {
  const torus = await initTorus(params.sdkArgs);
  
  const userInfo = await torus.triggerLogin({
    typeOfLogin: params.oauthProvider,
    verifier: params.torusVerifierName,
    clientId: params.oauthClientID
  });

  if (params.postLoginHook) {
    await params.postLoginHook(userInfo);
  }

  return {
    method: KeySourceMethod.TORUS,
    getKeyPair: async <Curve>(displayName: string, curveMarker: Curve) => {

      if (displayName !== userInfo.userInfo.name) {
        return null;
      }

      if (curveMarker.toString() === SECP256K1_STR) {
        const sk = skFromString(userInfo.privateKey, curveMarker);
        const keyPair = keyPairFromSk(sk);
        return keyPair;
      } else {
        const sk = skFromSeed(new Uint8Array(Buffer.from(userInfo.privateKey, 'hex')), curveMarker);
        const keyPair = keyPairFromSk(sk);
        return keyPair
      }
    },
  }
}