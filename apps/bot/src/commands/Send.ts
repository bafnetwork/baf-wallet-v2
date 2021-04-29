import { Message } from 'discord.js';
import { Command } from '../Command';
import { BotClient } from '../types';
import { transactions } from 'near-api-js';
import {
  createTransferURL,
  TransferParams,
} from '@baf-wallet/redirect-generator';
import { environment } from '../environments/environment';
import { Chain } from '@baf-wallet/interfaces';

export default class SendMoney extends Command {
  constructor(protected client: BotClient) {
    super(client, {
      name: 'sendMoney',
      description: 'sends NEAR or NEP-5 tokens on NEAR testnet',
      category: 'Utility',
      usage: `${client.settings.prefix}send [amount in yoctoNear] [asset (optional, defaults to 'NEAR')]  [recipient]`,
      cooldown: 1000,
      requiredPermissions: [],
    });
  }

  public async run(message: Message): Promise<void> {
    const content = message.content;
    if (!content) {
      throw Error('message content is empty!');
    }

    const params = content.split(' ');
    if (params.length < 3 || params.length > 4) {
      await super.respond(
        message.channel,
        `expected 2 parameters, got ${params.length - 1}.\n\`usage: ${
          this.conf.usage
        }\``
      );
      return;
    }

    let amount = parseInt(params[1]);
    if (Number.isNaN(amount)) {
      await super.respond(
        message.channel,
        '❌ invalid amount ❌: amount must be a number!'
      );
      return;
    }
    let asset = params[2];
    let recipient: string;
    if (params.length === 4) {
      asset = params[2];
      recipient = params[3];
    } else {
      recipient = params[2];
    }

    // Recipient should look like <@86890631690977280>
    let recipientParsed: string;
    try {
      recipientParsed = recipient.split('<@')[1].split('>')[0];
    } catch (e) {
      await super.respond(
        message.channel,
        '❌ invalid user ❌: the user must be tagged!'
      );
      return;
    }

    try {
      const tx: TransferParams = {
        recipientUserId: recipientParsed,
        amount: amount.toString(),
        oauthProvider: 'discord',
      };
      const link = createTransferURL(
        Chain.NEAR,
        environment.BASE_WALLET_URL,
        tx
      );
      await super.respond(message.channel, link);
    } catch (err) {
      console.error(err);
      await super.respond(
        message.channel,
        `🚧 an error has occurred 🚧:
        \n\`${err}\`
        \nPlease create an issue at https://github.com/bafnetwork/baf-wallet-v2/issues and HODL tight until we fix it.`
      );
      return;
    }
  }
}
