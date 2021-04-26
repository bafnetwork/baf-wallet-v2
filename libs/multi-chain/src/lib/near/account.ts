import {
  ChainAccount,
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
import { formatKey } from '../utils';
import { KeyPairEd25519 } from 'near-api-js/lib/utils';
import { getNearNodeUrl } from './utils';

interface NearAccountParamsBase {
  networkId: NearNetworkId;
  masterAccountId: string;
}
export interface NearAccountParamsFrontend extends NearAccountParamsBase {
  edSK: SecretKey;
}
export interface NearAccountParamsNode extends NearAccountParamsBase {
  keyPath: string;
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

  static async setConfigFrontend(params: NearAccountParamsFrontend) {
    this.initParams = {
      masterAccountId: params.masterAccountId,
      connectConfig: {
        networkId: params.networkId,
        nodeUrl: getNearNodeUrl(params.networkId),
        helperUrl: `https://helper.${params.networkId}.near.org`,
        masterAccount: params.masterAccountId,
      },
    };
    const keyStore = new InMemoryKeyStore();
    const newKeyPair = new KeyPairEd25519(
      formatKey(params.edSK, KeyFormats.BS58)
    );
    await keyStore.setKey(params.networkId, params.masterAccountId, newKeyPair);
    this.initParams.connectConfig.keyStore = keyStore;
  }

  static setConfigNode(params: NearAccountParamsNode) {
    this.initParams = {
      masterAccountId: params.masterAccountId,
      connectConfig: {
        networkId: params.networkId,
        nodeUrl: getNearNodeUrl(params.networkId),
        helperUrl: `https://helper.${params.networkId}.near.org`,
        masterAccount: params.masterAccountId,
        keyPath: params.keyPath,
      },
    };
    const keyStore =
      this.initParams.connectConfig.deps?.keyStore || new InMemoryKeyStore();
    this.initParams.connectConfig.deps = {
      ...(this.initParams.connectConfig.deps?.keyStore || {}),
      keyStore: keyStore,
    };
  }

  static async get(): Promise<NearAccount> {
    if (!this.initParams) {
      throw 'Near params must be set prior to calling getNea';
    }
    if (this.nearSingleton) {
      return this.nearSingleton;
    }
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
      this.initParams.connectConfig.deps?.keyStore ||
        this.initParams.connectConfig.keyStore,
      this.initParams
    );
    return this.nearSingleton;
  }

  async updateKeyPair(accountId: string, secret: SecretKey) {
    const newKeyPair = new KeyPairEd25519(formatKey(secret, KeyFormats.BS58));
    await this.keyStore.setKey(
      this.params.connectConfig.networkId,
      accountId,
      newKeyPair
    );
  }
}
