import { FormValidationRules } from 'ts-form-validation';
import { Chain, InferWrapChainInterface, InferWrappedChainInterface } from './chains';
import { ed25519, PublicKey, secp256k1, SecretKey } from './crypto';
import { TokenInfo } from './token-info';

export interface KeyState {
  edPK: PublicKey<ed25519>;
  secpPK: PublicKey<secp256k1>;
  secpSK: SecretKey<secp256k1>;
  edSK: SecretKey<ed25519>;
}

export interface CreateTxReturn<TXParams> {
  txParams: TXParams;
  recipientUser: string;
}

export interface FrontendBalance {
  tok: Chain;
  balance: string | number;
}

/***** Styling interfaces */
export type StyleType = 'primary' | 'secondary' | 'danger';

/***** Frontend account interfaces */
export interface Account {
  displayName: string;
  pubkey: string;
}

export interface OAuthState {
  verifierId: string;
  name: string;
  email: string;
}

export interface AccountState {
  loggedIn: boolean;
  oauthInfo?: OAuthState;
}

export type FormValidationFn<Chain, FormInterface> = (
  tokenInfo: TokenInfo,
  chain: Chain
) => Promise<FormValidationRules<FormInterface>>;
