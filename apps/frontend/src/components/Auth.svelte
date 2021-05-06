<script lang="ts">
  import Button from '@baf-wallet/base-components/Button.svelte';
  import Card from '@baf-wallet/base-components/Card.svelte';
  import Icon from '@baf-wallet/base-components/Icon.svelte';
  import { initTorusKeySource } from '@baf-wallet/torus/web';
  import { TorusLoginResponse } from '@toruslabs/torus-direct-web-sdk';
  import { secp256k1Marker } from '@baf-wallet/interfaces';
  import {
    AccountStore,
    storeOauthState,
    storeTorusAccessToken,
  } from '../state/accounts.svelte';
  import { buildKeyStateFromSecpSk, SiteKeyStore } from '../state/keys.svelte';
  import { apiClient } from '../config/api';
  import { constants } from '../config/constants';
  import { reinitApp } from '../config/init.svelte';
  import Spinner from 'svelte-spinner';
import { skFromString } from '@baf-wallet/crypto';

  //TODO: Change to global color vairable. See https://github.com/bafnetwork/baf-wallet-v2/issues/53
  let size = 50;
  let speed = 750;
  let color = '#A82124';
  let thickness = 2.0;
  let gap = 40;

  let isLoading = false;

  async function torusPostLoginHook(userInfo: TorusLoginResponse) {
    const accessToken = userInfo.userInfo.accessToken;
    storeOauthState({
      verifierId: userInfo.userInfo.verifierId,
      name: userInfo.userInfo.name,
      email: userInfo.userInfo.email,
    });
    storeTorusAccessToken(accessToken);
    await apiClient.revokeToken({
      revokeTokenParams: { token: accessToken },
    });

    const secpSk = skFromString(userInfo.privateKey, secp256k1Marker);

    SiteKeyStore.set(buildKeyStateFromSecpSk(secpSk));

    AccountStore.update((state) => {
      return {
        ...state,
        loggedIn: true,
      };
    });
    reinitApp();
  }

  async function discordLogin() {
    isLoading = true;
    await initTorusKeySource({
      sdkArgs: {
        baseUrl: `${constants.baseUrl}/serviceworker`,
        network: constants.torus.network, // details for test net
      },
      oauthProvider: 'discord',
      postLoginHook: torusPostLoginHook,
    });
    isLoading = false;
  }
</script>

<Card styleType="secondary">
  <h4>Sign in with a social provider</h4>
  <Button onClick={discordLogin} styleType="primary">
    <Icon iconName="Discord" />
  </Button>
  {#if isLoading}
    <Spinner {size} {speed} {color} {thickness} {gap} />
  {/if}
</Card>

<style>
</style>
