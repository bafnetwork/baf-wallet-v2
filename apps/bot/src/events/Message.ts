/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Message as DiscordMessage } from 'discord.js';
import { BotClient, BotEvent } from '../types';

export default class Message implements BotEvent {
  constructor(private readonly client: BotClient) {}

  name(): string {
    return 'message';
  }

  public async run(args?: any): Promise<void> {
    if (!(args instanceof DiscordMessage)) {
      // TODO use winston
      console.error('invalid args for Message event');
      return args;
    }

    const message: DiscordMessage = args;

    if (
      message.author.bot ||
      !message.content.startsWith(this.client.settings.prefix)
    )
      return;

    const argus = message.content.split(/\s+/g);
    const command = argus.shift()!.slice(this.client.settings.prefix.length);
    const cmd = this.client.commands.get(command);

    if (cmd === undefined || !(await cmd.canRun(message.author, message)))
      return;
    await cmd.run(message, argus);

    if (message.guild !== null) cmd.setCooldown(message.author, message.guild);
  }
}
