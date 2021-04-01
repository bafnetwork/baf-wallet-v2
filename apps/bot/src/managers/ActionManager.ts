import { Collection } from 'discord.js';
import { Service } from 'typedi';
import { Command } from '../Command';
import commandClasses from '../commands';
import eventClasses from '../events';
import { BotClient } from '../types';

@Service()
export class ActionManager {
  public commands: Collection<string, Command> = new Collection<
    string,
    Command
  >();

  /**
   * Parses files into commands from the configured command path.
   * @param {BotClient} client The original client, for access to the configuration.
   * @returns {Collection<string, Command>} A dictionary of every command in a [name, object] pair.
   */
  public initializeCommands(client: BotClient): void {
    commandClasses.forEach((C) => {
      const command = new C(client);
      console.log(command.conf.name);
      this.commands.set(command.conf.name, command);
    });
  }

  /**
   * Initializes every event from the configured event path.
   * @param {BotClient} client The original client, for access to the configuration.
   */
  public initializeEvents(client: BotClient): void {
    eventClasses.forEach((C) => {
      const event = new C(client);
      const eventName = event.name();
      console.log(eventName);
      client.on(eventName, (args?: any) => {
        console.log(`got a event of type ${eventName}!`);
        // eslint-disable-next-line
        event.run(args);
      });
    });
  }
}
