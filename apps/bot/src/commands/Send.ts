import { Message } from "discord.js";
import { Command } from "../Command";
import { BotClient } from "../types";

export default class SendMoney extends Command {

  constructor(protected client: BotClient) {
    super(client, {
      name: "send",
      description: "sends money on NEAR testnet",
      category: "Utility",
      usage: `${client.settings.prefix}send amount asset(optional, defaults to NEAR) recipient`,
      cooldown: 1000,
      requiredPermissions: [],
    });
  }

  public async run(message: Message): Promise<void> {

    const content = message.content;
    if (!content) {
      throw Error("message content is empty!");
    }

    const params = content.split(" ");
    if (params.length < 3 || params.length > 4) {
      await super.respond(
        message.channel,
        `expected 2 parameters, got ${params.length - 1}.\n usage: ${
          super.conf.usage
        }`
      );
      return;
    }

    let amount = params[1];
    let asset = "NEAR";
    let recipient: string;
    if (params.length === 4) {
        asset = params[2];
        recipient = params[3];
    } else {
        recipient = params[2];
    }
    try {
      await super.respond(message.channel, 'HODL tight, this command is still in the works 🚧');
    } catch (err) {
      console.error(err);
      await super.respond(message.channel, "invalid amount");
      return;
    }
  }
}
