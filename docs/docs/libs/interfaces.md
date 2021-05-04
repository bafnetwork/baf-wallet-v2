---
sidebar_position: 1
---

# Interfaces

## Purpose

In order to stay sane and productive when integrating many blockchains into a single project, we need to be able to decouple each integration from core wallet functionality as much as possible. Every chain worth integrating has its own SDK, which we should use in order to avoid re-inventing wheels. However, a separate SDK for each chain means separate types and interfaces for public keys, secret keys, key pairs, RPC calls, transactions, transaction signing, transaction sending, accounts, account metadata, and more, not to mention the fact that they are often object-orented and thus *stateful*, each in their own particular way. To not isolate all of this from our core functionality would quickly result in an epidemic of fugly code that's incredibly difficult to work with spreading across the BAF Wallet codebase.

In order to do this, we need some well-chosen unifying types and interfaces that abstract over the specific chain implementations - this is the purpose of `@baf-wallet/interfaces`. 

## `ChainInterface`

`ChainInterface` is by far the most complicated of the unifying interfaces supplied by `@baf-wallet/interfaces`. Take a gander at it. Totally understandable if it seems overwhelming - just know that it's defined in such a matter that 99% of the time you should never have to use it in a way that is overwhelming.

```ts title="libs/interfaces/src/lib/chains.ts"
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
  AccountCreateParams
> {
  rpc: (innerSdk: Inner) => RpcInterface<Tx, SignedTx, SendOpts, SendResult>;
  tx: (
    innerSdk: Inner
  ) => TxInterface<Tx, BuildTxParams, SignedTx, SignOpts, SendOpts, SendResult>;
  accounts: (
    innerSdk: Inner
  ) => AccountsInterface<Account, AccountLookupParams, AccountCreateParams>;
  init: (params: InitParams) => Promise<Inner>;
  convert: Converter<PK, SK, KP>;
}
```

At a high level, `ChainInterface` is a generic interface with a lot of type parameters whose properties refer to sub-interfaces dedicated to a particular subset of chain-specific functionality - `RpcInterface` for RPC calls, `TxInterface` for transactions, `AccountsInterface` for accounts, and `init` for any necessary initialization steps. 

Many of the type parameters can described as the chain-specific types for common things needed for interacting with a blockchain - for instance `PK` is the underlying implementations public key type, and `SK`, `KP`, and `Tx` similarly for secret keys, key pairs, and transactions. The only one that really warrants explanation is `Inner`.

`Inner` is a type that that must contain all "state" required by the underlying implementation - this includes all values that can change as a side effect of an operation and serves to allow us to separate state from execution, making our code much more flexible and easy to use in many different contexts. Typically, this will be an instance of the top-level class exposed by an object-oriented SDK. Sometimes the implementor of the BAF Wallet wrapper for that SDK might wish to include other values as well.

You might have noticed that the `rpc`, `tx`, and `accounts` properties of `ChainInterface` are actually functions that take an instance of `Inner` and return the relevant interfaces. This is how we separate state from execution - the actual code for implementing `ChainInterface` is a function that, given the state, performs the desired operation and updates the state. This has the benefit that you can use a different value of type `Inner` at different times but still use the same code, which allows for much more flexible code that makes it easy to tell when side effects occurr and where the state they change is.

That being said, for a majority of use cases having the state bundled together with the actual implementation is more than fine and makes things simple. This is where `WrappedChainInterface` comes in:

```ts title="libs/interfaces/src/lib/chains.ts"
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
  AccountCreateParams
> {
  rpc: RpcInterface<Tx, SignedTx, SendOpts, SendResult>;
  tx: TxInterface<Tx, BuildTxParams, SignedTx, SignOpts, SendOpts, SendResult>;
  accounts: AccountsInterface<
    Account,
    AccountLookupParams,
    AccountCreateParams
  >;
  convert: Converter<PK, SK, KP>;
  getInner: () => Inner;
}
```

as you can see, `WrappedChainInterface` is exactly the same as `ChainInterface`, but the functions have already been called for you, all using a single instance of `Inner`. Then we also provide a function in `@baf-wallet/multi-chain` that takes does exactly this.

## `KeySource`

TODO

## "Infer" types

TODO