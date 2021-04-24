import { PublicKey, SecretKey, KeyPair } from './crypto';

export enum Chain {
  near,
}

export interface WrappedChainInterface<
  PK,
  SK,
  KP,
  Tx,
  SignedTx,
  SignOpts,
  SendOpts,
  SendResult,
  Account,
  AccountLookupParams,
  AccountCreateParams
> {
  rpc: RpcInterface<Tx, SignedTx, SignOpts, SendOpts, SendResult>;
  tx: TxInterface<Tx, SignedTx, SignOpts, SendOpts, SendResult>;
  accounts: AccountsInterface<
    Account,
    AccountLookupParams,
    AccountCreateParams
  >;
  convert: Converter<PK, SK, KP>;
}

// interface that every chain implementation is expected to implement
// the 'innerSdk' HOF's are the way they are because most SDK's tend to be stateful (booooo)
// which we need to be able to keep track of.
// Since every SDK is probably going to be stateful, if at all, in a slightly different way,
// we need to decouple the sdk's state from the actual functionality. If the 'Inner' type is expected
// to contain all of the SDK's state, partial application affords us the flexibility we need to deal with
// any kind of statefulness. Note that Inner can theoretically be void in the case that the underlying
// SDK is stateless
export interface ChainInterface<
  PK,
  SK,
  KP,
  InitParams,
  Inner,
  Tx,
  SignedTx,
  SignOpts,
  SendOpts,
  SendResult,
  Account,
  AccountLookupParams,
  AccountCreateParams
> {
  rpc: (
    innerSdk: Inner
  ) => RpcInterface<Tx, SignedTx, SignOpts, SendOpts, SendResult>;
  tx: (
    innerSdk: Inner
  ) => TxInterface<Tx, SignedTx, SignOpts, SendOpts, SendResult>;
  accounts: (
    innerSdk: Inner
  ) => AccountsInterface<Account, AccountLookupParams, AccountCreateParams>;
  init: (params: InitParams) => Promise<Inner>;
  convert: Converter<PK, SK, KP>;
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
  sign: <Curve>(
    tx: Tx,
    keyPair: KeyPair<Curve>,
    opts?: SignOpts
  ) => Promise<SignedTx>;
  send: (tx: Tx | SignedTx, opts?: SendOpts) => Promise<SendResult>;
}

// utility for going to/from key BAF Wallet unified types
// each instance expected to be specific to a particular sdk so that
// we aren't ever locked into using BAF types and reimplementing wheelsA
// chains are expected to extend this with their own functions and/or values
export interface Converter<PK, SK, KP> {
  skFromBaf: <Curve>(bafSk: SecretKey<Curve>) => SK;
  skToBaf: <Curve>(sk: SK, curveMarker: Curve) => PublicKey<Curve>;
  pkFromBaf: <Curve>(bafPk: PublicKey<Curve>) => PK;
  pkToBaf: <Curve>(pk: PK, curveMarker: Curve) => SecretKey<Curve>;
  keyPairFromBaf: <Curve>(BafKeyPair: KeyPair<Curve>) => KP;
  keyPairToBaf: <Curve>(keyPair: KP, curveMaker: Curve) => KeyPair<Curve>;
  // TODO: add more methods for converting shit
}

export type InferChainInterface<T> = T extends ChainInterface<
  infer PK,
  infer SK,
  infer KP,
  infer InitParams,
  infer Inner,
  infer Tx,
  infer SignedTx,
  infer SignOpts,
  infer SendOpts,
  infer SendResult,
  infer Account,
  infer AccountLookupParams,
  infer AccountCreateParams
>
  ? ChainInterface<
      PK,
      SK,
      KP,
      InitParams,
      Inner,
      Tx,
      SignedTx,
      SignOpts,
      SendOpts,
      SendResult,
      Account,
      AccountLookupParams,
      AccountCreateParams
    >
  : never;
export type InferWrappedChainInterface<T> = T extends WrappedChainInterface<
  infer PK,
  infer SK,
  infer KP,
  infer Tx,
  infer SignedTx,
  infer SignOpts,
  infer SendOpts,
  infer SendResult,
  infer Account,
  infer AccountLookupParams,
  infer AccountCreateParams
>
  ? WrappedChainInterface<
      PK,
      SK,
      KP,
      Tx,
      SignedTx,
      SignOpts,
      SendOpts,
      SendResult,
      Account,
      AccountLookupParams,
      AccountCreateParams
    >
  : never;

export type InferWrapChainInterface<T> = T extends ChainInterface<
  infer PK,
  infer SK,
  infer KP,
  infer _,
  infer _,
  infer Tx,
  infer SignedTx,
  infer SignOpts,
  infer SendOpts,
  infer SendResult,
  infer Account,
  infer AccountLookupParams,
  infer AccountCreateParams
>
  ? WrappedChainInterface<
      PK,
      SK,
      KP,
      Tx,
      SignedTx,
      SignOpts,
      SendOpts,
      SendResult,
      Account,
      AccountLookupParams,
      AccountCreateParams
    >
  : never;

export type InferPK<T> = T extends ChainInterface<
  infer PK,
  infer SK,
  infer KP,
  infer InitParams,
  infer Inner,
  infer Tx,
  infer SignedTx,
  infer SignOpts,
  infer SendOpts,
  infer SendResult,
  infer Account,
  infer AccountLookupParams,
  infer AccountCreateParams
>
  ? PK
  : never;
export type InferSK<T> = T extends ChainInterface<
  infer PK,
  infer SK,
  infer KP,
  infer InitParams,
  infer Inner,
  infer Tx,
  infer SignedTx,
  infer SignOpts,
  infer SendOpts,
  infer SendResult,
  infer Account,
  infer AccountLookupParams,
  infer AccountCreateParams
>
  ? SK
  : never;
export type InferKP<T> = T extends ChainInterface<
  infer PK,
  infer SK,
  infer KP,
  infer InitParams,
  infer Inner,
  infer Tx,
  infer SignedTx,
  infer SignOpts,
  infer SendOpts,
  infer SendResult,
  infer Account,
  infer AccountLookupParams,
  infer AccountCreateParams
>
  ? KP
  : never;
export type InferInitParams<T> = T extends ChainInterface<
  infer PK,
  infer SK,
  infer KP,
  infer InitParams,
  infer Inner,
  infer Tx,
  infer SignedTx,
  infer SignOpts,
  infer SendOpts,
  infer SendResult,
  infer Account,
  infer AccountLookupParams,
  infer AccountCreateParams
>
  ? InitParams
  : never;
export type InferInner<T> = T extends ChainInterface<
  infer PK,
  infer SK,
  infer KP,
  infer InitParams,
  infer Inner,
  infer Tx,
  infer SignedTx,
  infer SignOpts,
  infer SendOpts,
  infer SendResult,
  infer Account,
  infer AccountLookupParams,
  infer AccountCreateParams
>
  ? Inner
  : never;
export type InferTx<T> = T extends ChainInterface<
  infer PK,
  infer SK,
  infer KP,
  infer InitParams,
  infer Inner,
  infer Tx,
  infer SignedTx,
  infer SignOpts,
  infer SendOpts,
  infer SendResult,
  infer Account,
  infer AccountLookupParams,
  infer AccountCreateParams
>
  ? Tx
  : never;
export type InferSignedTx<T> = T extends ChainInterface<
  infer PK,
  infer SK,
  infer KP,
  infer InitParams,
  infer Inner,
  infer Tx,
  infer SignedTx,
  infer SignOpts,
  infer SendOpts,
  infer SendResult,
  infer Account,
  infer AccountLookupParams,
  infer AccountCreateParams
>
  ? SignedTx
  : never;
export type InferSignOpts<T> = T extends ChainInterface<
  infer PK,
  infer SK,
  infer KP,
  infer InitParams,
  infer Inner,
  infer Tx,
  infer SignedTx,
  infer SignOpts,
  infer SendOpts,
  infer SendResult,
  infer Account,
  infer AccountLookupParams,
  infer AccountCreateParams
>
  ? SignOpts
  : never;
export type InferSendOpts<T> = T extends ChainInterface<
  infer PK,
  infer SK,
  infer KP,
  infer InitParams,
  infer Inner,
  infer Tx,
  infer SignedTx,
  infer SignOpts,
  infer SendOpts,
  infer SendResult,
  infer Account,
  infer AccountLookupParams,
  infer AccountCreateParams
>
  ? SendOpts
  : never;
export type InferSendResult<T> = T extends ChainInterface<
  infer PK,
  infer SK,
  infer KP,
  infer InitParams,
  infer Inner,
  infer Tx,
  infer SignedTx,
  infer SignOpts,
  infer SendOpts,
  infer SendResult,
  infer Account,
  infer AccountLookupParams,
  infer AccountCreateParams
>
  ? SendResult
  : never;
export type InferAccount<T> = T extends ChainInterface<
  infer PK,
  infer SK,
  infer KP,
  infer InitParams,
  infer Inner,
  infer Tx,
  infer SignedTx,
  infer SignOpts,
  infer SendOpts,
  infer SendResult,
  infer Account,
  infer AccountLookupParams,
  infer AccountCreateParams
>
  ? Account
  : never;
export type InferAccountLookupParams<T> = T extends ChainInterface<
  infer PK,
  infer SK,
  infer KP,
  infer InitParams,
  infer Inner,
  infer Tx,
  infer SignedTx,
  infer SignOpts,
  infer SendOpts,
  infer SendResult,
  infer Account,
  infer AccountLookupParams,
  infer AccountCreateParams
>
  ? AccountLookupParams
  : never;
export type InferAccountCreateParams<T> = T extends ChainInterface<
  infer PK,
  infer SK,
  infer KP,
  infer InitParams,
  infer Inner,
  infer Tx,
  infer SignedTx,
  infer SignOpts,
  infer SendOpts,
  infer SendResult,
  infer Account,
  infer AccountLookupParams,
  infer AccountCreateParams
>
  ? AccountCreateParams
  : never;
