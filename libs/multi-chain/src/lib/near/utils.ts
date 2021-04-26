import { NearNetworkId } from '@baf-wallet/interfaces';

export function getNearNodeUrl(networkId: NearNetworkId) {
  return `https://rpc.${networkId}.near.org`;
}
