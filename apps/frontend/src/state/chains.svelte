<script lang="ts" context="module">
  import {
    Chain,
    ChainInterface,
    Encoding,
    InferWrapChainInterface,
    KeyPair,
    KeyState,
    PublicKey,
    SecretKey,
  } from '@baf-wallet/interfaces';
  import {
    getNearNetworkID,
    NearChainInterface,
    NearInitParams,
    WrappedNearChainInterface,
  } from '@baf-wallet/near';
  import { getWrappedInterface } from '@baf-wallet/multi-chain';
  import { keyPairFromSk } from '@baf-wallet/crypto';
  import { writable } from 'svelte/store';
  import { environment } from '../environments/environment';
  import { apiClient } from '../config/api';

  export type ChainsState = {
    [Chain.NEAR]?: WrappedNearChainInterface;
  };

  export function checkChainInit(
    chainState: ChainsState,
    chain: Chain
  ): boolean {
    return !!chainState && !!chainState[chain];
  }

  export const ChainStores = writable<ChainsState | null>(null);

  export async function initChains(keys: KeyState) : Promise<ChainsState> {
    const nearAccountInfo = await apiClient.getAccountInfo({
      secpPubkeyB58: keys.secpPK.format(Encoding.BS58),
    });
    let chainInfos: ChainsState = {}
    if (nearAccountInfo.nearId && nearAccountInfo.nearId !== '') {
      const nearWrapped: WrappedNearChainInterface = await getWrappedInterface<NearChainInterface>(
        Chain.NEAR,
        {
          networkID: getNearNetworkID(environment.env),
          masterAccountID: nearAccountInfo.nearId,
          keyPair: keyPairFromSk(keys.edSK),
        } as NearInitParams
      );
      chainInfos[Chain.NEAR] = nearWrapped
 
    }
   ChainStores.set(chainInfos);
   return chainInfos
  }
</script>
