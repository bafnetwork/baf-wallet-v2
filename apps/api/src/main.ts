import * as bodyParser from 'body-parser';
import express from 'express';
import { RegisterRoutes } from '../build/routes';
import { constants } from './app/config/constants';
import * as cors from 'cors';
import { setBafContract } from '@baf-wallet/baf-contract';
import { Chain } from '@baf-wallet/interfaces';
import { getNearChain, initChains } from './app/chains/singletons';

const app = express();

async function initContracts() {
  const masterAccount = await getNearChain().accounts.lookup(
    constants.chainParams[Chain.NEAR].masterAccountID
  );
  await setBafContract(masterAccount);
}

async function init() {
  await initChains();
  await initContracts();
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(bodyParser.json());
  // const whitelist = [
  //   'http://localhost:8080',
  //   'https://baf-wallet.netlify.app',
  //   'https://baf-wallet-v2-git-deploy-work-baf-wallet.vercel.app',
  // ];
  // const corsOptions = {
  //   origin: function (origin, callback) {
  //     if (whitelist.indexOf(origin) !== -1) {
  //       callback(null, true);
  //     } else {
  //       callback(new Error('Not allowed by CORS'));
  //     }
  //   },
  // };
  // app.use(cors(corsOptions));

  RegisterRoutes(app);

  const port = process.env.port || 3333;
  const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
  });
  server.on('error', console.error);
}
init();
