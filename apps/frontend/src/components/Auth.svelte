<script lang="ts">
  import Button from './base/Button.svelte';
  import Card from './base/Card.svelte';
  import Icon from './base/Icon.svelte';
  import DirectWebSdk from '@toruslabs/torus-direct-web-sdk';
  import { AccountStore } from '../state/accounts.svelte';
  import { LOGIN as TORUS_LOGIN } from '@toruslabs/torus-direct-web-sdk';
import { KeyStore } from 'near-api-js/lib/key_stores';
import { SiteKeyStore } from '../state/keys.svelte';

  async function initTorus(): Promise<DirectWebSdk> {
    const torus = new DirectWebSdk({
      baseUrl: 'http://localhost:8080/serviceworker',
      // proxyContractAddress: '0x4023d2a0D330bF11426B12C6144Cfb96B7fa6183', // details for test net
      network: 'testnet', // details for test net
      // redirectToOpener: true,
      // uxMode: 'redirect',
    });
    await torus.init({ skipSw: true });
    return torus;
  }

  async function discordLogin() {
    const torus = await initTorus();
    const userInfo = await torus.triggerLogin({
      typeOfLogin: 'discord',
      verifier: 'baf wallet-discord-testnet',
      clientId: '821890148198776874',
    });
    console.log(userInfo);
    SiteKeyStore.set({
      secp256k1Pubkey: userInfo.publicAddress,
      ed25519Pubkey: 
    })
    // TODO: put elsewhere
    AccountStore.update((state) => {
      return {
        ...state,
        loggedIn: true,
        accessToken: {
          type: TORUS_LOGIN.DISCORD,
          token: userInfo.userInfo.accessToken,
        },
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
