import { PublicKey, SecretKey, KeyPair, secp256k1, ed25519 } from './crypto';
import { Pair } from '@baf-wallet/utils';
import { Account as NearAccount } from 'near-api-js';
import { GenericTxAction, GenericTxParams } from './tx';
import { Env } from './configs';

export enum Chain {
  NEAR = 'near',
}

// Or the type with all the supported chain account types
export type ChainAccount = NearAccount;

export type Balance = string;

export interface ChainBalance {
  chain: Chain;
  balance: Balance;
}

export type ExplorerLink = string;

// ChainInterface but with the partial application already done via a closure somewhere
// for instance, wrapChainInterface in @baf-wallet/multi-chain/switches
export interface WrappedChainInterface<
  PK,
  SK,
  KP,
  Inner,
  Tx,
  BuildTxParams,
  SignedTx,
  SignOpts,
  SendOpts,
  SendResult,
  Account,
  AccountLookupParams,
  AccountCreateParams,
  ContractInitParamsBase
> {
  rpc: RpcInterface<Tx, SignedTx, SendOpts, SendResult>;
  tx: TxInterface<Tx, BuildTxParams, SignedTx, SignOpts, SendOpts, SendResult>;
  accounts: AccountsInterface<
    Account,
    AccountLookupParams,
    AccountCreateParams
  >;
  convert: Converter<PK, SK, KP>;
  getConstants: (env: Env) => ChainConstants;
  getInner: () => Inner;
  getContract: <Contract, ContractInitParams, ContractInitParamsBase>(
    address: string
  ) => ContractInterface<Contract, ContractInitParams>;
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
  BuildTxParams,
  SignedTx,
  SignOpts,
  SendOpts,
  SendResult,
  Account,
  AccountLookupParams,
  AccountCreateParams,
  ContractInitParamsBase
> {
  init: (params: InitParams) => Promise<Inner>;
  rpc: (innerSdk: Inner) => RpcInterface<Tx, SignedTx, SendOpts, SendResult>;
  tx: (
    innerSdk: Inner
  ) => TxInterface<Tx, BuildTxParams, SignedTx, SignOpts, SendOpts, SendResult>;
  accounts: (
    innerSdk: Inner
  ) => AccountsInterface<Account, AccountLookupParams, AccountCreateParams>;
  convert: Converter<PK, SK, KP>;
  getConstants: (env: Env) => ChainConstants;
  getContract: <Contract, ContractInitParams extends ContractInitParamsBase>(
    innerSdk: Inner,
    address: string
  ) => ContractInterface<Contract, ContractInitParams>;
}

export interface ChainContractTokenConstant {
  contractAddress: string;
}
export interface ChainConstants {
  tokens: ChainContractTokenConstant[];
}

export interface AccountsInterface<Account, LookupParams, CreateParams> {
  lookup: (params: LookupParams) => Promise<Account>;
  create: (params: CreateParams) => Promise<Account>;
  getGenericMasterAccount: () => GenericAccount;
}

export type AccountContractTokenBalFn = (
  contractAddress: string
) => Promise<Balance>;

export interface GenericAccount {
  getBalance: () => Promise<Balance>;
  getContractTokenBalance: AccountContractTokenBalFn;
}

// bare minimum interface representing direct RPC methods to the chain
// chains are expected to extend this with their own functions and/or values
export interface RpcInterface<Tx, SignedTx, SendOpts, SendResult> {
  endpoint: (network?: string) => string;
}

// minimum interface representing all transaction-related operations
// chains are expected to extend this with their own functions and/or values
export interface TxInterface<
  Tx,
  BuildTxParams,
  SignedTx,
  SignOpts,
  SendOpts,
  SendResult
> {
  build: (params: BuildTxParams) => Promise<Tx>;
  sign: <Curve>(
    tx: Tx,
    keyPair: KeyPair<Curve>,
    opts?: SignOpts
  ) => Promise<SignedTx>;
  send: (
    tx: Tx | SignedTx,
    opts?: SendOpts
  ) => Promise<Pair<SendResult, ExplorerLink>>;
  buildParamsFromGenericTx: (
    params: GenericTxParams,
    recipientPk: PublicKey<secp256k1>,
    senderPkSecp: PublicKey<secp256k1>,
    senderPkEd: PublicKey<ed25519>
  ) => Promise<BuildTxParams>;
  extractGenericActionsFromTx: (params: BuildTxParams) => GenericTxAction[];
}

export interface ContractInterface<Contract, ContractInitParams> {
  init: <Contract>(params: ContractInitParams) => Promise<Contract>;
}

// utility for going to/from key BAF Wallet unified types
// each instance expected to be specific to a particular sdk so that
// we aren't ever locked into using BAF types and reimplementing wheelsA
// chains are expected to extend this with their own functions and/or values
export interface Converter<PK, SK, KP> {
  skFromUnified: <Curve>(unifiedSk: SecretKey<Curve>) => SK;
  skToUnified: <Curve>(sk: SK, curveMarker: Curve) => PublicKey<Curve>;
  pkFromUnified: <Curve>(unifiedPk: PublicKey<Curve>) => PK;
  pkToUnified: <Curve>(pk: PK, curveMarker: Curve) => SecretKey<Curve>;
  keyPairFromUnified: <Curve>(unifiedKeyPair: KeyPair<Curve>) => KP;
  keyPairToUnified: <Curve>(
    unifiedKeyPair: KP,
    curveMaker: Curve
  ) => KeyPair<Curve>;
  // add more methods for converting shit as necessary
}

export type InferChainInterface<T> = T extends ChainInterface<
  infer PK,
  infer SK,
  infer KP,
  infer InitParams,
  infer Inner,
  infer Tx,
  infer BuildTxParams,
  infer SignedTx,
  infer SignOpts,
  infer SendOpts,
  infer SendResult,
  infer Account,
  infer AccountLookupParams,
  infer AccountCreateParams,
  infer ContractInitParamsBase
>
  ? ChainInterface<
      PK,
      SK,
      KP,
      InitParams,
      Inner,
      Tx,
      BuildTxParams,
      SignedTx,
      SignOpts,
      SendOpts,
      SendResult,
      Account,
      AccountLookupParams,
      AccountCreateParams,
      ContractInitParamsBase
    >
  : never;
export type InferWrappedChainInterface<T> = T extends WrappedChainInterface<
  infer PK,
  infer SK,
  infer KP,
  infer Inner,
  infer Tx,
  infer BuildTxParams,
  infer SignedTx,
  infer SignOpts,
  infer SendOpts,
  infer SendResult,
  infer Account,
  infer AccountLookupParams,
  infer AccountCreateParams,
  infer ContractInitParamsBase
>
  ? WrappedChainInterface<
      PK,
      SK,
      KP,
      Inner,
      Tx,
      BuildTxParams,
      SignedTx,
      SignOpts,
      SendOpts,
      SendResult,
      Account,
      AccountLookupParams,
      AccountCreateParams,
      ContractInitParamsBase
    >
  : never;

export type InferWrapChainInterface<T> = T extends ChainInterface<
  infer PK,
  infer SK,
  infer KP,
  infer _,
  infer Inner,
  infer Tx,
  infer BuildTxParams,
  infer SignedTx,
  infer SignOpts,
  infer SendOpts,
  infer SendResult,
  infer Account,
  infer AccountLookupParams,
  infer AccountCreateParams,
  infer ContractInitParamsBase
>
  ? WrappedChainInterface<
      PK,
      SK,
      KP,
      Inner,
      Tx,
      BuildTxParams,
      SignedTx,
      SignOpts,
      SendOpts,
      SendResult,
      Account,
      AccountLookupParams,
      AccountCreateParams,
      ContractInitParamsBase
    >
  : never;

export type InferPK<T> = T extends ChainInterface<
  infer PK,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _
>
  ? PK
  : never;
export type InferSK<T> = T extends ChainInterface<
  infer _,
  infer SK,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _
>
  ? SK
  : never;
export type InferKP<T> = T extends ChainInterface<
  infer _,
  infer _,
  infer KP,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _
>
  ? KP
  : never;
export type InferInitParams<T> = T extends ChainInterface<
  infer _,
  infer _,
  infer _,
  infer InitParams,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _
>
  ? InitParams
  : never;
export type InferInner<T> = T extends ChainInterface<
  infer _,
  infer _,
  infer _,
  infer _,
  infer Inner,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _
>
  ? Inner
  : never;
export type InferTx<T> = T extends ChainInterface<
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer Tx,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _
>
  ? Tx
  : never;
export type InferTxBuildParams<T> = T extends ChainInterface<
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer TxBuildParams,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _
>
  ? TxBuildParams
  : never;

export type InferSignedTx<T> = T extends ChainInterface<
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer SignedTx,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _
>
  ? SignedTx
  : never;

export type InferSignOpts<T> = T extends ChainInterface<
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer SignOpts,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _
>
  ? SignOpts
  : never;

export type InferSendOpts<T> = T extends ChainInterface<
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer SendOpts,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _
>
  ? SendOpts
  : never;

export type InferSendResult<T> = T extends ChainInterface<
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer SendResult,
  infer _,
  infer _,
  infer _,
  infer _
>
  ? SendResult
  : never;

export type InferAccount<T> = T extends ChainInterface<
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer Account,
  infer _,
  infer _,
  infer _
>
  ? Account
  : never;

export type InferAccountLookupParams<T> = T extends ChainInterface<
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer AccountLookupParams,
  infer _,
  infer _
>
  ? AccountLookupParams
  : never;

export type InferAccountCreateParams<T> = T extends ChainInterface<
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer AccountCreateParams,
  infer _
>
  ? AccountCreateParams
  : never;

export type InferContractInitParamsBase<T> = T extends ChainInterface<
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer _,
  infer ContractInitParamsBase
>
  ? ContractInitParamsBase
  : never;
