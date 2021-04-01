import { Client as DiscordClient, Collection } from 'discord.js';
import { connect } from 'near-api-js';
import { InMemoryKeyStore } from 'near-api-js/lib/key_stores';
import 'reflect-metadata';
import { Service } from 'typedi';
import { Command } from './Command';
import { settings as configuration } from './config/config';
import getConfig from './getConfig';
import { ActionManager } from './managers/ActionManager';
import { BotClient, BotSettings } from './types';

@Service()
export class Client extends DiscordClient implements BotClient {
  public settings: BotSettings;

  constructor(private readonly actionManager: ActionManager) {
    super(configuration.clientOptions ?? {});
    this.settings = configuration;
    this.initialize();
  }

  private initialize(): void {
    try {
      this.actionManager.initializeCommands(this);
      this.actionManager.initializeEvents(this);
    } catch (e) {
      console.error(`Could not initialize bot: ${e as string}`);
    }
  }

  public get commands(): Collection<string, Command> {
    return this.actionManager.commands;
  }
}
