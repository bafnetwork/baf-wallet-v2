import { Message } from 'discord.js';
import { Command } from '../Command';
import { BotClient } from '../types';

export default class Help extends Command {
  constructor(client: BotClient) {
    super(client, {
      name: 'Help',
      description: 'Help commands bot.',
      category: 'Information',
      usage: client.settings.prefix.concat('help'),
      cooldown: 1000,
      requiredPermissions: ['SEND_MESSAGES'],
    });
  }

  public async run(message: Message): Promise<void> {
    await super.respond(message.channel, 
        'Help - List out all the commands \n '+
        'Ping - Respond Pong! \n ' +
        'Send - sends NEAR or NEP-141 tokens on NEAR testnet');
  }
}
