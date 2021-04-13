import { NearSupportedActionTypes } from '@baf-wallet/interfaces';
import { NearSendTXOpts } from '@baf-wallet/multi-chain';
import BN = require('bn.js');
import { transactions } from 'near-api-js';
import { NearGenerator } from './generator';

describe('Create different urls for Near Actions', () => {
  const generator = new NearGenerator(
    'http://localhost:8080/#/approve-redirect'
  );
  it('should create a url for transferring some NEAR', () => {
    const sendMoney = transactions.transfer(new BN(1000000));
    const link = generator.createURL({
      actions: [
        {
          type: NearSupportedActionTypes.TRANSFER,
          params: {
            discriminator: NearSupportedActionTypes.TRANSFER,
            amount: '1000',
          },
        },
      ],
      receiverAccountId: 'thisisgoingnowhere',
    });
    console.log('Created link', link);
  });
});
