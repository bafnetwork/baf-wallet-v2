<script lang="ts">
  import Button from './base/Button.svelte';
  import Card from './base/Card.svelte';
  import Icon from './base/Icon.svelte';
  import { AccountStore, storeOauthState } from '../state/accounts.svelte';
  import { buildKeyStateFromSecpSK, SiteKeyStore } from '../state/keys.svelte';
  import { keyFromString, secp256k1 } from '@baf-wallet/multi-chain';
  import { KeyFormats } from '@baf-wallet/interfaces';
  import { apiClient } from '../config/api';
  import { constants } from '../config/constants';
  import { buildTorusWebSdk, triggerLogin } from '@baf-wallet/torus/web';

  async function discordLogin() {
    const torus = await buildTorusWebSdk(`${constants.baseUrl}/serviceworker`);

    const token = localStorage.getItem('access-token:discord');
    if (token) {
      await apiClient.revokeToken({
        revokeTokenParams: { token },
      });
    }

    const userInfo = await triggerLogin(torus, 'discord');
    localStorage.setItem('access-token:discord', userInfo.userInfo.accessToken);
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
