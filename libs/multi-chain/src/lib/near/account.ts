import { CryptoCurves, NearNetworkId } from '@baf-wallet/interfaces';
import { Account, connect, ConnectConfig, Near } from 'near-api-js';

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
    const near = await connect(this.initParams.connectConfig);

    const masterAccount = await near.account(this.initParams.masterAccountId);
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
