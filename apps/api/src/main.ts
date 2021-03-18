/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as bodyParser from 'body-parser';
import * as express from 'express';
import { RegisterRoutes } from '../build/routes';

const app = express();

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
