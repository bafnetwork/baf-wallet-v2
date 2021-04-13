<script lang="ts">
  import Button from './base/Button.svelte';
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

<form action="">
  <p>Sign in with a social provider</p>
  <div class="social-provider">
    <Button>
      <img src="/assets/Discord-Logo-White.svg" alt="Discord Sign In" />
    </Button>
  </div>
</form>
