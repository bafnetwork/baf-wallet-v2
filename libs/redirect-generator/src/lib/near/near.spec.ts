import { NearSendTXOpts } from '@baf-wallet/multi-chain';
import BN = require('bn.js');
import { transactions } from 'near-api-js';
import { NearGenerator } from './generator';

describe('Create different urls for Near Actions', () => {
  const generator = new NearGenerator(
    'http://localhost:4200/#/approve-redirect'
  );
  it('should create a url for transferring some NEAR', () => {
    const sendMoney = transactions.transfer(new BN(1000000));
    const link = generator.createURL(
      new NearSendTXOpts([sendMoney], 'this is going no where')
    );
    console.log('Created link', link);
  });
});
