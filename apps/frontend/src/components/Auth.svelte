<script lang="ts">
  import Button from './base/Button.svelte';
  import Card from './base/Card.svelte';
  import Icon from './base/Icon.svelte';
  import DirectWebSdk from '@toruslabs/torus-direct-web-sdk';
  async function initTorus() : Promise<DirectWebSdk> {
    const torus = new DirectWebSdk({
      baseUrl: 'http://localhost:3000/serviceworker/',
      proxyContractAddress: '0x4023d2a0D330bF11426B12C6144Cfb96B7fa6183', // details for test net
      network: 'testnet', // details for test net
    });
    await torus.init();
    return torus
  }

  async function discordLogin() {
    const torus = await initTorus()
    const userInfo = await torus.triggerLogin({
      typeOfLogin: 'discord',
      verifier: 'MY VERIFIER NAME',
      clientId: '821890148198776874',
    });
  }
</script>

<Card classExtra="w-1/2 object-center flex flex-col items-center">
  <h1 class="pb-4 text-xl">Sign in with a social provider</h1>
  <div class="social-is">
    <Button classExtra="w-12">
      <Icon iconName="Discord"/>
    </Button>
  </div>
</Card>

