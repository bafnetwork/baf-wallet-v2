import 'reflect-metadata';
import { environment } from "./environments/environment";
import { Container } from 'typedi';
import { Client } from './Client';

// Initialize the Client using the IoC.
const client = Container.get<Client>(Client);

// console.log(environment.DISCORD_TOKEN);

client
  .login(environment.DISCORD_TOKEN)
  .then(() => {
    console.log('tokenbot happily hodling along');
  })
  .catch((e) => console.error(e));
