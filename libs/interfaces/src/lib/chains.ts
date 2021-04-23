import {PublicKey, SecretKey, KeyPair } from './crypto';

export enum Chain {
  NEAR = 'near',
}

export interface ChainInterface<Tx, SignedTx, SignOpts, SendOpts, SendResult, Account, AccountLookupParams, AccountCreateParams> {
  rpc: RpcInterface<Tx, SignedTx, SignOpts, SendOpts, SendResult>;
  tx: TxInterface<Tx, SignedTx, SignOpts, SendOpts, SendResult>;
  accounts: AccountsInterface<Account, AccountLookupParams, AccountCreateParams>;
  convert: Converter;
  inner: ChainSpecificInterface;
}

export interface ChainSpecificInterface {
  [name: string]: any;
}

export interface AccountsInterface<Account, LookupParams, CreateParams> {
  lookup: (params: LookupParams) => Promise<Account>;
  create: (params: CreateParams) => Promise<Account>;
}

// bare minimum interface representing direct RPC methods to the chain
// chains are expected to extend this with their own functions and/or values
export interface RpcInterface<Tx, SignedTx, SignOpts, SendOpts, Send> {
  endpoint: (network?: string) => string;
}

// minimum interface representing all transaction-related operations
// chains are expected to extend this with their own functions and/or values
export interface TxInterface<Tx, SignedTx, SignOpts, SendOpts, SendResult> {
  sign: <Curve>(tx: Tx, keyPair: KeyPair<Curve>, opts?: SignOpts) => Promise<SignedTx>;
  send: (tx: Tx | SignedTx, opts?: SendOpts) => Promise<SendResult>;
}

// utility for going to/from key BAF Wallet unified types
// each instance expected to be specific to a particular sdk so that
// we aren't ever locked into using BAF types and reimplementing wheelsA
// chains are expected to extend this with their own functions and/or values
export interface Converter {
  skFromBaf: <Curve>(bafSk: SecretKey<Curve>) => any;
  skToBaf: <Curve>(sk: any) => PublicKey<Curve>;
  pkFromBaf: <Curve>(bafPk: PublicKey<Curve>) => any;
  pkToBaf: <Curve>(pk: any) => SecretKey<Curve>;
  keyPairFromBaf: <Curve>(BafKeyPair: KeyPair<Curve>) => any;
  keyPairToBaf: <Curve>(keyPair: any) => KeyPair<Curve>;
  // TODO: add more methods for converting shit
}