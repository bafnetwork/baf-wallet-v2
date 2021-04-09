import axios from 'axios';
import 'reflect-metadata';
import { jsonObject, jsonMember, TypedJSON, jsonArrayMember } from 'typedjson';



// typed JSON objects for parsing info.json's from trustwallet's assets repo
// e.g. https://github.com/trustwallet/assets/blob/master/blockchains/bitcoin/info/info.json
@jsonObject
export class SocialMediaInfo {
    @jsonMember
    public name: string; // platform
    @jsonMember
    public url: string;
    @jsonMember
    public handle: string;
}

@jsonObject
export class ChainInfo {
    @jsonMember
    public name: ChainName;
    @jsonMember
    public website: string;
    @jsonMember
    public source_code: string;
    @jsonMember
    public white_paper: string;
    @jsonMember
    public description: string;
    @jsonArrayMember(SocialMediaInfo)
    public socials?: SocialMediaInfo[];
    @jsonMember
    public explorer: string;
    @jsonMember
    public symbol: string;
    @jsonMember
    public type: "COIN";
    @jsonMember
    public decimals: number;
    @jsonMember
    public status: "active" | "abandoned";
    @jsonMember
    public tags?: string[];
}

// TODO: have some intelligent way to get the rest
export type ChainName = 
      "ethereum"
    | "bitcoin"
    | "near"
    | "solana"
    | "cosmos"
    | "celo"
    | "polkadot"
    | "filecoin"
    | "harmony"
    | "algorand"
    | "avalanche"
    | "matic"
    | "doge"
    | "terra";

// TODO: have some intelligent way to get the rest
export type DappUrl = 
      "0x.org"
    | "1inch.exchange"
    | "aave.com"
    | "aavegotchi.com"
    | "app.aave.com"
    | "app.compound.finance"
    | "app.ens.domains"
    | "app.paraswap.io"
    | "app.pooltogether.com"
    | "app.uniswap.org"
    | "axieinfinity.com"
    | "balancer.finance"
    | "bank.spankchain.com"
    | "cdp.makerdao"
    | "compound.finance"
    | "curve.fi"
    | "dydx.exhange"
    | "ens.domains"
    | "info.uniswap.org"
    | "instadapp.io"
    | "kyber.network"
    | "kyber.org"
    | "market.decentraland.org"
    | "marketplace.axieinfinity.com"
    | "opensea.io"
    | "pooltogether.com"
    | "pooltogether.us"
    | "rarible.com"
    | "snark.art"
    | "uniswap.io"
    | "uniswap.exchange"
    | "yearn.finance";

export const getChainFolderPrefix = (chain: ChainName): string => `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chain}`;

export const getChainInfoUrl = (chain: ChainName): string => `${getChainFolderPrefix(chain)}/info/info.json`;

export const getChainLogoUrl = (chain: ChainName): string => `${getChainFolderPrefix(chain)}/info/logo.png`;

export const getDappLogoUrl = (dappUrl: DappUrl): string => `https://raw.githubusercontent.com/trustwallet/assets/master/dapps/${dappUrl}.png`;

export async function getChainInfo(chain: ChainName): Promise<ChainInfo> {
    const url = getChainInfoUrl(chain);
    try {
        const res = await axios.get(url);
        const { data } = res;

        // remove binance shill link
        if (data.research !== undefined) {
            delete data.research;
        }

        const serializer = new TypedJSON(ChainInfo);
        return serializer.parse(data);
    } catch (err) {
        if (err.isAxiosError) {
            throw new Error("Chain not found: only chains in https://raw.githubusercontent.com/trustwallet/assets/master/blockchains are supported.")
        }
        throw new Error(`Received invalid info.json: ${err}. See \`ChainInfo\` in trust-wallet-assets/src/lib/index.ts for more information`);
    }
}

