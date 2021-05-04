import { Chain, GenericTxSupportedActions } from '@baf-wallet/interfaces';
import { createApproveRedirectURL } from './redirect-generator';

describe('frontend', () => {
  it('Create a url to send 100 yoctoNEAR to lev_s#7844', () => {
    const sendURL = createApproveRedirectURL(
      Chain.NEAR,
      'http://localhost:8080',
      {
        recipientUserId: '473198585890996224',
        recipientUserIdReadable: 'lev_s#7844',
        actions: [
          {
            type: GenericTxSupportedActions.TRANSFER,
            amount: '10000',
          },
        ],
        oauthProvider: 'discord',
      }
    );
    console.log(sendURL);
  });
  it('Create a url to send 100 yoctoFt.levtester to sladuca#4629', () => {
    const sendURL = createApproveRedirectURL(
      Chain.NEAR,
      'http://localhost:8080',
      {
        recipientUserId: '216732707449733120',
        recipientUserIdReadable: 'sladuca#4629',
        actions: [
          {
            type: GenericTxSupportedActions.TRANSFER_CONTRACT_TOKEN,
            amount: '10000',
            contractAddress: 'ft.levtester.testnet',
            memo: 'This is cool'
          },
        ],
        oauthProvider: 'discord',
      }
    );
    console.log(sendURL);
  });
});
