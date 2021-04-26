<script lang="ts">
  import Button from './base/Button.svelte';
  import Card from './base/Card.svelte';
  import Icon from './base/Icon.svelte';
  import DirectWebSdk from '@toruslabs/torus-direct-web-sdk';
  import { AccountStore, storeOauthState } from '../state/accounts.svelte';
  import { buildKeyStateFromSecpSK, SiteKeyStore } from '../state/keys.svelte';
  import { keyFromString, secp256k1 } from '@baf-wallet/multi-chain';
  import { KeyFormats } from '@baf-wallet/interfaces';
  import { apiClient } from '../config/api';
  import { constants } from '../config/constants';

  async function initTorus(): Promise<DirectWebSdk> {
    const torus = new DirectWebSdk({
      baseUrl: `${constants.baseUrl}/serviceworker`,
      network: 'testnet', // details for test net, TODO: ropsten
      proxyContractAddress: '0x4023d2a0D330bF11426B12C6144Cfb96B7fa6183',
    });
    await torus.init();
    return torus;
  }

  async function discordLogin() {
    const torus = await initTorus();

    const token = localStorage.getItem('access-token:discord');
    if (token) {
      console.log('revoking token from client');
      await apiClient.revokeToken({
        revokeTokenParams: { token },
      });
    }

    const userInfo = await torus.triggerLogin({
      typeOfLogin: 'discord',
      verifier: constants.torus.discord.verifier,
      clientId: constants.torus.discord.clientId,
    });
    localStorage.setItem('access-token:discord', userInfo.userInfo.accessToken);

    console.log(userInfo.userInfo);
    storeOauthState({
      name: userInfo.userInfo.name,
      email: userInfo.userInfo.email,
      verifierId: userInfo.userInfo.verifierId,
    });
    SiteKeyStore.set(
      buildKeyStateFromSecpSK(
        keyFromString(userInfo.privateKey, KeyFormats.HEX)
      )
    );
    AccountStore.update((state) => {
      return {
        ...state,
        loggedIn: true,
      };
    });
  }
</script>

<Card classExtra="w-1/2 object-center flex flex-col items-center">
  <h1 class="pb-4 text-xl">Sign in with a social provider</h1>
  <div class="social-is">
    <Button classExtra="w-12" onClick={discordLogin}>
      <Icon iconName="Discord" />
    </Button>
  </div>
</Card>
