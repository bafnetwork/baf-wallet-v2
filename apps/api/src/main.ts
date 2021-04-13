/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Envs, getNearNetworkId } from '@baf-wallet/interfaces';
import { NearAccountSingelton } from '@baf-wallet/multi-chain';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { RegisterRoutes } from '../build/routes';

const app = express();

// TODO: put into constants once StoreKeys merged
const defaultNearConfig = {
  masterAccountId: 'levtester.testnet',
  connectConfig: {
    networkId: getNearNetworkId(Envs.DEV),
    nodeUrl: 'https://rpc.testnet.near.org',
    keyPath: '/home/lev/.near-credentials/testnet/levtester.testnet.json',
    explorerUrl: 'https://explorer.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    masterAccount: 'levtester.testnet',
  },
};
NearAccountSingelton.setConfig(defaultNearConfig);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

RegisterRoutes(app);

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
