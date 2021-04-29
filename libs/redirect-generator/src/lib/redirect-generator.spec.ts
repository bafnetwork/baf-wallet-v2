import { Chain } from '@baf-wallet/interfaces';
import { createTransferURL } from './redirect-generator';

describe('frontend', () => {

  it('Create a url to send 100 yoctoNEAR to lev_s#7844', () => {
    const sendURL = createTransferURL(Chain.NEAR, 'http://localhost:8080', {
      recipientUserId: 'lev_s#7844',
      amount: '1000000',
      oauthProvider: 'discord'
    })
    console.log(sendURL)
  });
});

