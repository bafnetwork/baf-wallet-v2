import { Chain } from '@baf-wallet/interfaces';

export abstract class Signer<SendOpts> {
  chain: Chain;

  constructor(_chain: Chain) {
    this.chain = _chain;
  }

  abstract awaitConstructorInit(): Promise<void>;

  // Return an explorer link
  abstract sendTX(chainOpts?: SendOpts): Promise<string>;

  public static deserializeSendTXOpts<SendOpts>(opts: string): SendOpts {
    try {
      return JSON.parse(decodeURIComponent(opts)) as any as SendOpts;
    } catch (e) {
      throw `Error deserializing ${opts}: ${e}`;
    }
  }

  public static serializeSendTXOpts(opts: any) {
    return encodeURIComponent(JSON.stringify(opts));
  }
}
