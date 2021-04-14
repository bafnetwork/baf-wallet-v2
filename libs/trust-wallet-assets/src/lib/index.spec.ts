import { getChainInfo, getChainLogoUrl, getDappLogoUrl } from '.';
describe('getChainInfo', () => {
  it('retrieves correct values for ethereum', () =>
    getChainInfo('ethereum').then((info) => {
      expect(info).not.toBeUndefined();
      expect(info).not.toBeNull();
      expect(info.name).toBe('Ethereum');
      expect(info.website).toBe('https://ethereum.org/');
      expect(info.source_code).toBe('https://github.com/ethereum');
      expect(info.white_paper).toBe(
        'https://github.com/ethereum/wiki/wiki/White-Paper'
      );
      expect(info.description).toBe(
        'Open source platform to write and distribute decentralized applications.'
      );
      expect(info.socials).toEqual([
        {
          name: 'Twitter',
          url: 'https://twitter.com/ethereum',
          handle: 'ethereum',
        },
        {
          name: 'Reddit',
          url: 'https://www.reddit.com/r/ethereum',
          handle: 'ethereum',
        },
      ]);
      expect(info.explorer).toBe('https://etherscan.io/');

      // make sure binance shill was removed
      expect((info as any).research).toBeUndefined();
      expect(info.symbol).toBe('ETH');
      expect(info.type).toBe('COIN');
      expect(info.decimals).toBe(18);
      expect(info.status).toBe('active');
    }));
});
