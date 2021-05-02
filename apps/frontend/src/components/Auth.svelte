<script lang="ts">
  import Button from './base/Button.svelte';
  import Card from './base/Card.svelte';
  import Icon from './base/Icon.svelte';
  import { initTorusKeySource } from '@baf-wallet/torus/web';
  import { TorusLoginResponse } from '@toruslabs/torus-direct-web-sdk';
  import { secp256k1Marker } from '@baf-wallet/interfaces';
  import { AccountStore } from '../state/accounts.svelte';
  import { buildKeyStateFromSecpSk, SiteKeyStore } from '../state/keys.svelte';
  import { apiClient } from '../config/api';
  import { constants } from '../config/constants';
  import { skFromString } from '@baf-wallet/utils';

  async function torusPostLoginHook(userInfo: TorusLoginResponse) {
    await apiClient.revokeToken({
      revokeTokenParams: { token: userInfo.userInfo.accessToken },
    });

    const secpSk = skFromString(userInfo.privateKey, secp256k1Marker);

    SiteKeyStore.set(buildKeyStateFromSecpSk(secpSk));

    AccountStore.update((state) => {
      return {
        ...state,
        loggedIn: true,
      };
    });
  }

  async function discordLogin() {
    await initTorusKeySource({
      sdkArgs: {
        baseUrl: `${constants.baseUrl}/serviceworker`,
        network: constants.torus.network, // details for test net
      },
      oauthProvider: 'discord',
      postLoginHook: torusPostLoginHook
    });
  }
</script>

<Card >
  <h4>Sign in with a social provider</h4>
  <Button onClick={discordLogin} styleType='primary'>
    <Icon iconName="Discord" />
  </Button>
</Card>

<style>
</style>
