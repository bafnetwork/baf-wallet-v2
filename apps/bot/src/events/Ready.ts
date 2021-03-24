import { BotClient, BotEvent } from "../types";

export default class Ready implements BotEvent {
  private readonly client: BotClient;
  constructor(client: BotClient) {
    this.client = client;
  }

  name(): string {
    return "ready";
  }

  public async run(): Promise<void> {
    if (this.client.user !== null) {
      console.log(`${this.client.user.username} is ready!`);
      await this.client.user.setPresence(this.client.settings.presence);
    }
  }
}
