import { CryptoCurves, NearNetworkId } from '@baf-wallet/interfaces';
import {
  Account,
  connect,
  ConnectConfig,
  InMemorySigner,
  KeyPair,
  Near,
} from 'near-api-js';
import {
  AccountCreator,
  LocalAccountCreator,
  UrlAccountCreator,
} from 'near-api-js/lib/account_creator';
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

  private constructor(
    public near: Near,
    public masterAccount: Account,
    public accountCreator: AccountCreator,
    private keyStore: KeyStore,
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
    this.nearSingleton = new NearAccountSingelton(
      near,
      masterAccount,
      urlAccountCreator,
      keyStore,
      this.initParams
    );
    return this.nearSingleton;
  }
  getAccountNameFromPubkey(pubkey: string, curve: CryptoCurves): string {
    return `${curve}_${pubkey}.${
      this.params.connectConfig.networkId === NearNetworkId.MAINNET
        ? 'near'
        : this.params.connectConfig.networkId
    }`.toLowerCase();
  }

  async updateKeyPair(accountId: string, keyPair: KeyPair) {
    await this.keyStore.setKey(
      this.params.connectConfig.networkId,
      accountId,
      keyPair
    );
  }
}
