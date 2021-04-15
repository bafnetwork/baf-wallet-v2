import { NearAccount } from '@baf-wallet/multi-chain';
import * as bodyParser from 'body-parser';
import express from 'express';
import { RegisterRoutes } from '../build/routes';
import { constants } from './app/config/constants';

const app = express();

NearAccount.setConfig(constants.nearAccountConfig);
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
