import { Chain } from '@baf-wallet/interfaces';
export abstract class RedirectGenerator {
  constructor(protected chain: Chain, protected baseURL: string) {}

  abstract createURL(opts?: any): string | Promise<string>;
}
