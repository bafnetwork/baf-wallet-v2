<script lang="ts">
  import Button from './base/Button.svelte';
  import Card from './base/Card.svelte';
  import Icon from './base/Icon.svelte';
  import DirectWebSdk from '@toruslabs/torus-direct-web-sdk';
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

  // (window as any).tryTorus = async () => {
  //   const torus = await initTorus();
  //   const ret = await torus.getRedirectResult();
  //   console.log(ret);
  // };
  // https://discord.com/oauth2/authorize?state=eyJpbnN0YW5jZUlkIjoiQmFSa0VlaWhtZnpWbGlyZ1BRUDJsenhTZVcwRng1IiwidmVyaWZpZXIiOiJiYWYgd2FsbGV0LWRpc2NvcmQtdGVzdG5ldCIsInR5cGVPZkxvZ2luIjoiZGlzY29yZCIsInJlZGlyZWN0VG9PcGVuZXIiOmZhbHNlfQ%253D%253D&response_type=token&client_id=821890148198776874&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fserviceworker%2Fredirect&scope=identify+email

  async function discordLogin() {
    const torus = await initTorus();
    const userInfo = await torus.triggerLogin({
      typeOfLogin: 'discord',
      verifier: 'baf wallet-discord-testnet',
      clientId: '821890148198776874',
    });
    console.log(userInfo)
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
