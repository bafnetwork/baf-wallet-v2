import DirectWebSdk, {
  TorusLoginResponse,
} from '@toruslabs/torus-direct-web-sdk';
import { assertLoginTypeRegistered, torusConstants, TORUS_LOGIN_TYPE } from '../common';
export async function buildTorusWebSdk(baseUrl): Promise<DirectWebSdk> {
  const torus = new DirectWebSdk({
    baseUrl,
    network: 'testnet', // details for test net, TODO: ropsten
    proxyContractAddress: '0x4023d2a0D330bF11426B12C6144Cfb96B7fa6183',
  });
  await torus.init();
  return torus;
}

export async function triggerLogin(
  torus: DirectWebSdk,
  loginType: TORUS_LOGIN_TYPE
): Promise<TorusLoginResponse> {
  assertLoginTypeRegistered(loginType)
  return await torus.triggerLogin({
    typeOfLogin: 'discord',
    verifier: torusConstants.verifierInfo[loginType].verifier,
    clientId: torusConstants.verifierInfo[loginType].clientId
  });
}
