import 'reflect-metadata';
import { Container } from 'typedi';
import { Client } from './Client';

// Initialize the Client using the IoC.
const client = Container.get<Client>(Client);

console.log(process.env.DISCORD_TOKEN);

client
  .login(process.env.DISCORD_TOKEN)
  .then(() => {
    console.log('tokenbot happily hodling along');
  })
  .catch((e) => console.error(e));
