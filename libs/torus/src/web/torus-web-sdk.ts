import {
  KeySourceMethod,
  KeySource,
  KeySourceInitFn,
  SECP256K1_STR,
} from '@baf-wallet/interfaces';
import { skFromString } from '@baf-wallet/utils';
import { keyPairFromSk, skFromSeed } from '@baf-wallet/crypto';

import DirectWebSdk, {
  LOGIN_TYPE,
  DirectWebSDKArgs,
  TorusLoginResponse,
} from '@toruslabs/torus-direct-web-sdk';
import { torusConstants } from '@baf-wallet/torus';

export type OAuthDisplayName = string;
export interface TorusInitArgs {
  sdkArgs: DirectWebSDKArgs;
  oauthProvider: LOGIN_TYPE;
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
export const initTorusKeySource: KeySourceInitFn<
  OAuthDisplayName,
  TorusInitArgs
> = async (params: TorusInitArgs): Promise<TorusKeySource> => {
  const torus = await initTorus(params.sdkArgs);

  const userInfo = await torus.triggerLogin({
    typeOfLogin: params.oauthProvider,
    verifier: torusConstants.verifierInfo[params.oauthProvider].verifier,
    clientId: torusConstants.verifierInfo[params.oauthProvider].clientId,
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
        const sk = skFromSeed(
          new Uint8Array(Buffer.from(userInfo.privateKey, 'hex')),
          curveMarker
        );
        const keyPair = keyPairFromSk(sk);
        return keyPair;
      }
    },
  };
};
