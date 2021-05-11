import { FormValidationRules, MessageType } from 'ts-form-validation';
import { formatTokenAmountToIndivisibleUnit } from '@baf-wallet/multi-chain';
import {
  FormValidationFn,
  InferWrappedChainInterface,
  TokenInfo,
  WrappedChainInterface,
} from '@baf-wallet/interfaces';
import BN from 'bn.js';

export interface SendForm {
  recipientAddress: string;
  amount: number;
}

export const buildSendFormRules = <
  Chain extends InferWrappedChainInterface<any>
>(
  _chainSignifier: Chain
): FormValidationFn<Chain, SendForm> => {
  return async (tokenInfo: TokenInfo, chain: Chain) => {
    const recipientAddressChecks = true; //await chain.
    const currBalance = new BN(
      await chain.accounts.getGenericMasterAccount().getBalance()
    );
    const sendFormRules: FormValidationRules<SendForm> = {
      fields: {
        recipientAddress: {
          required: true,
          trim: false,
          validate: (val: string) => recipientAddressChecks,
        },
        amount: {
          required: true,
          trim: false,
          validate: (val: number) => {
            const amountIndivis = formatTokenAmountToIndivisibleUnit(
              val,
              tokenInfo.decimals
            );
            const hasBalance = new BN(amountIndivis).lte(currBalance);
            console.log(hasBalance)
            return (
              (val >= 0 && hasBalance) || {
                type: MessageType.ERROR,
                // TODO: amount format how much you have
                message: `Please an enter an amount between 0 ${tokenInfo.symbol} and your current balance, XXXX ${tokenInfo.symbol}`,
              }
            );
          },
        },
      },
    };
    return sendFormRules;
  };
};
