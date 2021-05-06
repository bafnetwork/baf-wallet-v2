(global as any).window = {
  name: 'nodejs',
};

import { getBafContract, setBafContract } from '@baf-wallet/baf-contract';
import {
  keyPairFromSk,
  pkFromString,
  signMsg,
  skFromSeed,
} from '@baf-wallet/crypto';
import {
  Chain,
  ed25519Marker,
  Encoding,
  Env,
  GenericTxParams,
  GenericTxSupportedActions,
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
import { config as dotenvConfig } from 'dotenv';
import { createUserVerifyMessage } from '@baf-wallet/utils';
import BN from 'bn.js';

dotenvConfig({ path: './env/.env.unit-test' });

const seed = new Uint8Array(Buffer.from(process.env.HEX_SEED, 'hex'));
const edPair = keyPairFromSk(skFromSeed(seed, ed25519Marker));
const secpPair = keyPairFromSk(skFromSeed(seed, secp256k1Marker));

const MAX_GAS_USAGE_INDIVISIBLE_UNITS = new BN('1000000000000000000000');

const configs = {
  near: {
    networkID: getNearNetworkID(Env.TEST),
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
    actions: [
      {
        type: GenericTxSupportedActions.TRANSFER,
        amount: '1',
      },
    ],
  } as GenericTxParams;
  // Send the tx to Lev's discord account :)
  const receiver = secpPair.pk;
  const txParams = await chain.tx.buildParamsFromGenericTx(
    genericTx,
    pkFromString(
      // Lev's BS58 key
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
  const diff = new BN(priorBal).sub(new BN(currBall));
  expect(diff.lt(MAX_GAS_USAGE_INDIVISIBLE_UNITS.addn(1))).toEqual(true);
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
    const accountId = chains[Chain.NEAR].getInner().nearMasterAccount.accountId;
    const bafContractNonce = await getBafContract().getAccountNonce(
      secpPair.pk
    );
    await getBafContract().setAccountInfo(
      secpPair.pk,
      accountId,
      signMsg(
        secpPair.sk,
        createUserVerifyMessage(accountId, bafContractNonce),
        true
      ),
      accountId
    );
    done();
  });

  it('Test transactions', async () => {
    await testTx<WrappedNearChainInterface>(chains[Chain.NEAR]);
  });
  it('Test accounts', async () => {
    await testAccount<WrappedNearChainInterface>(chains[Chain.NEAR]);
  });
});
