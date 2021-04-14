import {
  CryptoCurves,
  KeyFormats,
  NearNetworkId,
  SecretKey,
} from '@baf-wallet/interfaces';
import { Account, connect, ConnectConfig, KeyPair, Near } from 'near-api-js';
import {
  AccountCreator,
  UrlAccountCreator,
} from 'near-api-js/lib/account_creator';
import { InMemoryKeyStore, KeyStore } from 'near-api-js/lib/key_stores';
import { PublicKey } from '@baf-wallet/interfaces';
import { formatKey } from '../utils';
import { KeyPairEd25519 } from 'near-api-js/lib/utils';

export interface NearAccountParams {
  networkId: NearNetworkId;
  keyPath: string;
  masterAccountId: string;
}

interface NearAccountParamsInternal {
  masterAccountId: string;
  connectConfig: ConnectConfig;
}

export class NearAccount {
  private static nearSingleton: NearAccount | null;
  private static initParams: NearAccountParamsInternal | null;

  private constructor(
    public near: Near,
    public masterAccount: Account,
    public accountCreator: AccountCreator,
    private keyStore: KeyStore,
    private params: NearAccountParamsInternal
  ) {}

  static setConfig(params: NearAccountParams) {
    this.initParams = {
      masterAccountId: params.masterAccountId,
      connectConfig: {
        networkId: params.networkId,
        nodeUrl: `https://rpc.${params.networkId}.near.org`,
        helperUrl: `https://helper.${params.networkId}.near.org`,
        masterAccount: params.masterAccountId,
        keyPath: params.keyPath,
      },
    };
  }

  static async get(): Promise<NearAccount> {
    if (!this.initParams) {
      throw 'Near params must be set prior to calling getNea';
    }
    if (this.nearSingleton) {
      return this.nearSingleton;
    }
    const keyStore =
      this.initParams.connectConfig.deps?.keyStore || new InMemoryKeyStore();
    this.initParams.connectConfig.deps = {
      ...(this.initParams.connectConfig.deps?.keyStore || {}),
      keyStore: keyStore,
    };
    const near = await connect(this.initParams.connectConfig);

    // const masterAccount = (near.accountCreator as LocalAccountCreator).masterAccount;
    // near.connection.provider
    const masterAccount = await near.account(this.initParams.masterAccountId);
    const urlAccountCreator = new UrlAccountCreator(
      near.connection,
      this.initParams.connectConfig.helperUrl
    );

    // masterAccount.connection.signer;
    this.nearSingleton = new NearAccount(
      near,
      masterAccount,
      urlAccountCreator,
      keyStore,
      this.initParams
    );
    return this.nearSingleton;
  }

  getAccountNameFromPubkey(pubkey: PublicKey, curve: CryptoCurves) {
    return NearAccount.getAccountNameFromPubkey(
      pubkey,
      curve,
      this.params.connectConfig.networkId as NearNetworkId
    );
  }

  static getAccountNameFromPubkey(
    pubkey: PublicKey,
    curve: CryptoCurves,
    networkId: NearNetworkId
  ): string {
    return `${curve}_${formatKey(pubkey, KeyFormats.bs58)}.${
      networkId === NearNetworkId.MAINNET ? 'near' : networkId
    }`.toLowerCase();
  }

  async updateKeyPair(accountId: string, secret: SecretKey) {
    await this.keyStore.setKey(
      this.params.connectConfig.networkId,
      accountId,
      new KeyPairEd25519(formatKey(secret, KeyFormats.bs58))
    );
  }
}
