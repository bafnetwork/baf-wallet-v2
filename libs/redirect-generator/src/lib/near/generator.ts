import { Chain } from '@baf-wallet/interfaces';
import { RedirectGenerator } from '../interfaces/base-classes';
import { NearSendTXOpts, NearSigner } from '@baf-wallet/multi-chain';

export class NearGenerator extends RedirectGenerator {
  constructor(baseURL: string) {
    super(Chain.NEAR, baseURL);
  }

  public createURL(opts: NearSendTXOpts) {
    return `${this.baseURL}/${NearSigner.serializeSendTXOpts(opts)}`;
  }
}
