<script lang="ts">
  import Button from './base/Button.svelte';
  import Card from './base/Card.svelte';
  import Icon from './base/Icon.svelte';
  import DirectWebSdk from '@toruslabs/torus-direct-web-sdk';
  import { AccountStore } from '../state/accounts.svelte';
  import { LOGIN as TORUS_LOGIN } from '@toruslabs/torus-direct-web-sdk';
  import { KeyStore } from 'near-api-js/lib/key_stores';
  import { buildKeyStateFromSecpSK, SiteKeyStore } from '../state/keys.svelte';
  import { keyFromString } from '@baf-wallet/multi-chain';
  import { KeyFormats } from '@baf-wallet/interfaces';
  import { apiClient } from '../config/api';
  import { constants } from '../config/constants';

  async function initTorus(): Promise<DirectWebSdk> {
    const torus = new DirectWebSdk({
      baseUrl: `${constants.baseUrl}/serviceworker`,
      network: 'testnet', // details for test net
    });
    await torus.init();
    return torus;
  }

  async function discordLogin() {
    const torus = await initTorus();
    const userInfo = await torus.triggerLogin({
      typeOfLogin: 'discord',
      verifier: constants.torus.discord.verifier,
      clientId: constants.torus.discord.clientId,
    });
    SiteKeyStore.set(
      buildKeyStateFromSecpSK(
        keyFromString(userInfo.privateKey, KeyFormats.hex)
      )
    );
    AccountStore.update((state) => {
      return {
        ...state,
        loggedIn: true,
      };
    });
    await apiClient.revokeToken({
      revokeTokenParams: { token: userInfo.userInfo.accessToken },
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
