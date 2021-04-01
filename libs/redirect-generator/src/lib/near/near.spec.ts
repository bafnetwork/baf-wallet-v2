import { transfer } from 'near-api-js/lib/transaction';
import { NearGenerator } from './generator';

describe('Create different urls for Near Actions', () => {
  const generator = new NearGenerator('http://localhost:4200/#/approve-redirect')
  it('should create a url for transferring some NEAR', () => {
    const link = generator.createURL({
      actions: [transfer(100000)],
      receiverAccountId: 'this is going no where'
    })
    console.log("Created link", link)
  })
})
