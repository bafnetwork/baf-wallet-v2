import { NearAccount } from '@baf-wallet/multi-chain';
import * as bodyParser from 'body-parser';
import express from 'express';
import { RegisterRoutes } from '../build/routes';
import { constants } from './app/config/constants';
import * as cors from 'cors';

const app = express();

NearAccount.setConfig(constants.nearAccountConfig);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
const whitelist = ['http://localhost:8080',];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
app.use(cors(corsOptions));

RegisterRoutes(app);

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});
server.on('error', console.error);
