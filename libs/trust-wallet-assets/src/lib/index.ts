import axios from 'axios';
import { BafError } from '@baf-wallet/errors';
import 'reflect-metadata';
import { Chain, TokenInfo, TokenInfoJSON } from '@baf-wallet/interfaces';
import { TypedJSON } from 'typedjson';

const baseRawUrl = 'https://raw.githubusercontent.com/bafnetwork/assets/master';

// typed JSON objects for parsing info.json's from trustwallet's assets repo
// e.g. https://github.com/trustwallet/assets/blob/master/blockchains/bitcoin/info/info.json
// TODO: have some intelligent way to get the rest
export type DappUrl =
  | '0x.org'
  | '1inch.exchange'
  | 'aave.com'
  | 'aavegotchi.com'
  | 'app.aave.com'
  | 'app.compound.finance'
  | 'app.ens.domains'
  | 'app.paraswap.io'
  | 'app.pooltogether.com'
  | 'app.uniswap.org'
  | 'axieinfinity.com'
  | 'balancer.finance'
  | 'bank.spankchain.com'
  | 'cdp.makerdao'
  | 'compound.finance'
  | 'curve.fi'
  | 'dydx.exhange'
  | 'ens.domains'
  | 'info.uniswap.org'
  | 'instadapp.io'
  | 'kyber.network'
  | 'kyber.org'
  | 'market.decentraland.org'
  | 'marketplace.axieinfinity.com'
  | 'opensea.io'
  | 'pooltogether.com'
  | 'pooltogether.us'
  | 'rarible.com'
  | 'snark.art'
  | 'uniswap.io'
  | 'uniswap.exchange'
  | 'yearn.finance';

export const getChainFolderPrefix = (chain: Chain): string =>
  `${baseRawUrl}/blockchains/${chain}`;

const getNonNativeTokenInfoUrl = (
  chain: Chain,
  contractAddress: string
): string => `${getChainFolderPrefix(chain)}/${contractAddress}/info.json`;

const getChainInfoUrl = (chain: Chain): string =>
  `${getChainFolderPrefix(chain)}/info/info.json`;

const getNonNativeTokenLogoUrl = (
  chain: Chain,
  contractAddress: string
): string => `${getChainFolderPrefix(chain)}/${contractAddress}/logo.png`;

const getChainLogoUrl = (chain: Chain): string =>
  `${getChainFolderPrefix(chain)}/info/logo.png`;

export const getTokenLogoUrl = (chain: Chain, contractAddress?: string) =>
  chain === contractAddress || !contractAddress
    ? getChainLogoUrl(chain)
    : getNonNativeTokenLogoUrl(chain, contractAddress);

export const getDappLogoUrl = (dappUrl: DappUrl): string =>
  `${baseRawUrl}/dapps/${dappUrl}.png`;

export async function getTokenInfo(
  chain: Chain,
  contractAddress?: string
): Promise<TokenInfo> {
  const tokenIsChain = chain === contractAddress || !contractAddress;
  const url = tokenIsChain
    ? getChainInfoUrl(chain)
    : getNonNativeTokenInfoUrl(chain, contractAddress);
  try {
    const res = await axios.get(url);
    const { data } = res;

    // remove binance shill link
    if (data.research !== undefined) {
      delete data.research;
    }

    const serializer = new TypedJSON(TokenInfoJSON);
    const _tokInfo = serializer.parse(data);
    return {
      ..._tokInfo,
      chain,
    };
  } catch (err) {
    if (err.isAxiosError) {
      console.log(
        `Chain not found: only chains in ${baseRawUrl} are supported.`
      );
      return null;
    }
    throw BafError.InvalidTrustWalletJSON(err);
  }
}
