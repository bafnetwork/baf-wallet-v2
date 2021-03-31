import { Chain } from "./chains";

export abstract class Signer {
  chain: Chain

  constructor(_chain: Chain) {
    this.chain = _chain
  }

  abstract awaitConstructorInit(): Promise<void>;
  
  // Return an explorer link
  abstract sendTX(chainOpts?: any) : Promise<string>;
}