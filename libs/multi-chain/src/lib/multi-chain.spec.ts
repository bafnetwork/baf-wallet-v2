(global as any).window = {
  name: 'nodejs',
};

import { setBafContract } from '@baf-wallet/baf-contract';
import {
  keyPairFromSk,
  pkFromString,
  skFromRng,
  skFromSeed,
  skFromString,
} from '@baf-wallet/crypto';
import {
  Chain,
  ed25519,
  ed25519Marker,
  Encoding,
  Env,
  GenericTxParams,
  GenericTxSupportedActions,
  InferWrapChainInterface,
  InferWrappedChainInterface,
  secp256k1Marker,
} from '@baf-wallet/interfaces';
import {
  getNearNetworkID,
  NearChainInterface,
  NearInitParams,
  WrappedNearChainInterface,
} from '@baf-wallet/near';
import { getWrappedInterface } from './index';
console.log(process.env.NEAR_MASTER_ACCOUNT_ID);

// TODO: initialize BAF Wallet testing accounts which use the same seed for secp and ed
const edPair = keyPairFromSk(
  skFromString(process.env.NEAR_SK, ed25519Marker, Encoding.BS58)
);
const seed = new Uint8Array(
  Buffer.from(
    'af4391c50ca34de55165ffbfcd9e43a846a37ef97905988b694ba886d23c05d5',
    'hex'
  )
);
const secpPair = keyPairFromSk(skFromSeed(seed, secp256k1Marker));
const configs = {
  near: {
    networkID: getNearNetworkID(Env.DEV),
    masterAccountID: process.env.NEAR_MASTER_ACCOUNT_ID,
    keyPair: edPair,
  } as NearInitParams,
};

const testAccount = async <T>(chain: InferWrappedChainInterface<T>) => {
  const proms = [chain.accounts.getGenericMasterAccount().getBalance()];
  await Promise.all(proms);
};

const testTx = async <T>(chain: InferWrappedChainInterface<T>) => {
  const genericTx = {
    recipientUserId: 'lev#78422',
    recipientUserIdReadable: 'lev#xxxx',
    oauthProvider: 'discord',
    actions: [
      {
        type: GenericTxSupportedActions.TRANSFER,
        amount: '1',
      },
    ],
  } as GenericTxParams;
  const txParams = await chain.tx.buildParamsFromGenericTx(
    genericTx,
    pkFromString(
      // My key
      'RY91cAma5JZRKheLDrBy1BknWvvpjoyz2fPbqDoYYey6TNYdqfUrNrNVnmfiT8RCSWKWxhjiUpwZWbxZmzGxwLK8',
      secp256k1Marker,
      Encoding.BS58
    ),
    secpPair.pk,
    edPair.pk
  );
  const priorBal = await chain.accounts.getGenericMasterAccount().getBalance();
  const tx = await chain.tx.build(txParams);
  const signed = await chain.tx.sign(tx, edPair);
  await chain.tx.send(signed);
  const currBall = await chain.accounts.getGenericMasterAccount().getBalance();
  const lastDigitPrior = parseInt(priorBal.slice(-1));
  const lastDigitCurr = parseInt(currBall.slice(-1));
  if (lastDigitPrior === 0) {
    expect(lastDigitCurr).toEqual(9);
  } else {
    expect(lastDigitCurr).toEqual(lastDigitPrior - 1);
  }
};

describe('Test all supported chains', () => {
  let chains: {
    near: WrappedNearChainInterface;
  };

  beforeAll(async (done) => {
    chains = {
      near: await getWrappedInterface<NearChainInterface>(
        Chain.NEAR,
        configs[Chain.NEAR]
      ),
    };
    await setBafContract(chains[Chain.NEAR].getInner().nearMasterAccount);
    done();
  });

  it('Test transactions', async () => {
    await testTx<WrappedNearChainInterface>(chains[Chain.NEAR]);
  });
  it('Test accounts', async () => {
    await testAccount<WrappedNearChainInterface>(chains[Chain.NEAR]);
  });
});
