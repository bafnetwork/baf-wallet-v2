import { Form, initForm, MessageFields } from 'ts-form-validation';
import {
  FormValidationFn,
  InferWrappedChainInterface,
  TokenInfo,
} from '@baf-wallet/interfaces';

export async function checkForm<
  Chain extends InferWrappedChainInterface<any>,
  FormInterface
>(
  tokenInfo: TokenInfo,
  chain: Chain,
  buildFormRules: FormValidationFn<Chain, FormInterface>,
  initVals: FormInterface
): Promise<boolean | MessageFields<FormInterface>> {
  const rules = await buildFormRules(tokenInfo, chain);
  const form: Form<FormInterface> = initForm(initVals, rules);
  rules.validateForm()
  return form.isFormValid || form.messages;
}
