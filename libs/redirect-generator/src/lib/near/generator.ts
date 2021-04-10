import { Chain } from '@baf-wallet/interfaces';
import { RedirectGenerator } from '../interfaces/base-classes';
import { transactions } from 'near-api-js';
import { Signer } from '@baf-wallet/multi-chain';

export interface NearCreateUrlOpts {
  actions: transactions.Action[];
  receiverAccountId: string;
}

export class NearGenerator extends RedirectGenerator {
  constructor(baseURL: string) {
    super(Chain.NEAR, baseURL);
  }

  public createURL(opts: NearCreateUrlOpts): string {
    return `${this.baseURL}/${Signer.serializeSendTXOpts(opts)}`;
  }
}
