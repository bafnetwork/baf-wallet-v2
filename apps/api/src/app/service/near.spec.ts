(global as any).window = {
  name: 'nodejs'
}
  window.name ='nodejs'
import { createNearAccount } from './near';

const secp256k1Privkey =
  '0308478518be29b8873c60a0df824df0d0ca72337d62360e419693d84f0ae8ec';
const secp256k1Pubkey =
  'BfaBf538323A1D21453b5F6a374A07867D867197'; // TODO: derive from torus
  (global as any).window = {
    name: 'nodejs'
  }
describe('Create a dummy near account on the testnet', () => {
  it('should create the account', async () => {
    await createNearAccount(secp256k1Pubkey, 'ed25519:4Nw2guqrdZ4sJiEQSLYm1icaAfdCiCQwS2Tp5qiSVkay');
  });
});
