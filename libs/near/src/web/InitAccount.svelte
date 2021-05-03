<script lang="ts">
  import Input from '@baf-wallet/base-components/Input.svelte';
  import Button from '@baf-wallet/base-components/Button.svelte';
  import { Encoding, KeyState, AccountState } from '@baf-wallet/interfaces';
  import { createUserVerifyMessage, formatBytes } from '@baf-wallet/utils';
  import { signMsg } from '@baf-wallet/crypto';
  import { DefaultApi } from '@baf-wallet/api-client';

  let newAccountId: string;

  export let apiClient: DefaultApi;
  export let keyState: KeyState;
  export let accountState: AccountState;
  export let cb: () => void = () => {}

  async function initNearAccount() {
    const nonce = await apiClient.getAccountNonce({
      secpPubkeyB58: keyState.secpPK.format(Encoding.BS58),
    });
    const userId = accountState.oauthInfo.verifierId;
    const edSig = signMsg(
      keyState.edSK,
      createUserVerifyMessage(userId, nonce)
    );
    const secpSigBafEncoded = signMsg(
      keyState.secpSK,
      createUserVerifyMessage(userId, nonce),
      true
    );
    const secpSig = signMsg(
      keyState.secpSK,
      createUserVerifyMessage(userId, nonce)
    );

    await apiClient.createNearAccount({
      createNearAccountParams: {
        userID: userId,
        nonce,
        edPubkey: keyState.edPK.format(Encoding.HEX),
        accountID: newAccountId,
        secpSigS: formatBytes(secpSigBafEncoded, Encoding.HEX),
        edSigHex: formatBytes(edSig, Encoding.HEX),
        secpSigHex: formatBytes(secpSig, Encoding.HEX),
      },
    });
    alert('Success');
    cb();
  }
</script>

<div>
  <form
    action=""
    on:submit={(e) => {
      e.preventDefault();
      initNearAccount();
    }}
  >
    <Input
      label="Account ID"
      placeholder="john.doe.testnet"
      bind:value={newAccountId}
    />
    <Button type="submit">Initialize Account with Near</Button>
  </form>
</div>
