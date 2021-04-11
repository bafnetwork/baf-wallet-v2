import { CryptoCurves } from '@baf-wallet/interfaces';
import { Account, connect, ConnectConfig, InMemorySigner, Near } from 'near-api-js';
import { LocalAccountCreator } from 'near-api-js/lib/account_creator';
import {
  InMemoryKeyStore,
  KeyStore,
  UnencryptedFileSystemKeyStore,
} from 'near-api-js/lib/key_stores';
import { dirname } from 'path';

interface NearSingletonParams {
  connectConfig: ConnectConfig;
  masterAccountId: string;
}

export class NearAccountSingelton {
  private static nearSingleton: NearAccountSingelton | null;
  private static initParams: NearSingletonParams | null;
  private static keyStore: KeyStore;

  private constructor(
    public near: Near,
    public masterAccount: Account,
    private params: NearSingletonParams
  ) {}

  static setConfig(params: NearSingletonParams) {
    this.initParams = params;
  }

  static async get(): Promise<NearAccountSingelton> {
    if (!this.initParams) {
      throw 'Near params must be set prior to calling getNea';
    }
    if (this.nearSingleton) {
      return this.nearSingleton;
    }
    this.keyStore =
      this.initParams.connectConfig.deps?.keyStore || new InMemoryKeyStore();
    this.initParams.connectConfig.deps = {
      ...(this.initParams.connectConfig.deps?.keyStore || {}),
      keyStore: this.keyStore,
    };
    const near = await connect(this.initParams.connectConfig);

    // const masterAccount = (near.accountCreator as LocalAccountCreator).masterAccount;
    // near.connection.provider
    const masterAccount = await near.account(this.initParams.masterAccountId);
    
    // masterAccount.connection.signer;
    this.nearSingleton = new NearAccountSingelton(
      near,
      masterAccount,
      this.initParams
    );
    return this.nearSingleton;
  }
  getAccountNameFromPubkey(pubkey: string, curve: CryptoCurves): string {
    return `${curve}:${pubkey}.${this.params.connectConfig.networkId}`;
  }
}
