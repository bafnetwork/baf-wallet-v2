import {
  Chain,
  PublicKey,
  ed25519,
  secp256k1,
  Encoding,
} from '@baf-wallet/interfaces';

export namespace BafError {
  export const UninitChain = (chain: Chain) =>
    emitError(`You must initialize your account on ${chain} first.`);
  export const InvalidSignature = (pk: PublicKey<ed25519 | secp256k1>) =>
    emitError(
      `An invalid signature has been provided for ${pk.format(Encoding.HEX)}`
    );
  export const Unimplemented = () => emitError('Unimplemented');
  export const InvalidTransactionApproveRedirect = () =>
    emitError(
      "The transaction must be either in the url or passed in through the component's state"
    );
  export const InvalidPackedKey = () =>
    emitError('The key in storage has an invalid format');
  export const UnsupportedKeyCurve = (supportedCurve: string) =>
    emitError(`Only ${supportedCurve} keys are supported`);
  export const BlockedByCors = () => emitError('Not allowed by CORS policy');
  export const UnintBafContract = () =>
    emitError(
      'BAF Contract is not initialized yet, please call setBafContract'
    );
  export const UnsupportedToken = (tokenName: string) =>
    emitError(`Unsupported token ${tokenName}`);
  export const UnsupportedChain = (chainName: string) =>
    emitError(`Unsupported blockchain ${chainName}`);
  export const MissingInitBalance = (chain: Chain) =>
    emitError(
      `An initial balance must be specified when initializing an account on ${chain}`
    );
  export const MissingKeyPair = () =>
    emitError('A key path or key pair must be provided');
  export const UnknownNetworkIdent = (identifier: string) =>
    emitError(`Unknown network identifier ${identifier}`);
  export const InvalidChainInfoJSON = (err: any) =>
    emitError(
      `Received invalid info.json: ${err}. See \`ChainInfo\` in chain-info/src/lib/index.ts for more information`
    );
  export const UnsupportedEncoding = (fmt: any) =>
    emitError(`Encoding for format ${fmt} is unsupported`);
  export const GenericTxRequiresOauthInfo = () =>
    emitError(
      `The generic transaction requires the recipient user id, its readable form, and the oauth provider`
    );
  export const SecpPKNotAssociatedWithAccount = (chain: Chain) =>
    emitError(
      `The provided public key is not associated with an account on ${chain}`
    );
  export const NonuniformTxActionRecipients = (chain: Chain) =>
    emitError(`${chain} only supports one recipient for a set of Tx Actions`);
  export const MissingContractAddress = () =>
    emitError(`The contract address must be specified`);
  export const InvalidTokenContractAddress = (addr: string) =>
    emitError(`Address ${addr} does not exist or is not a token contract`);
  export const InvalidContractAddress = (addr: string) =>
    emitError(`Address ${addr} does not exist or is not a contract`);
}

// A wrapper function to emit an error, this would allow us to do things such as easier Sentry logging
function emitError(errStr: string) {
  return new Error(errStr);
}
