---
sidebar_position: 2
---

# `ChainInterface`

## Explanation

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
```

As you can see, `WrappedChainInterface` is exactly the same as `ChainInterface`, but the functions have already been called for you, all using a single instance of `Inner`. Then we also provide [a function in `@baf-wallet/multi-chain` that takes does exactly this](https://github.com/bafnetwork/baf-wallet-v2/blob/7baf9cc62220b0e023120d728ef2405793a89c8f/libs/multi-chain/src/lib/switches.ts#L14). For the vast majority of use cases, this is sufficient. For cases where it's not, you can construct your own instances of inner, either using the relevant baf wallet library (e.g. `@baf-wallet/near` for `NearChainInterface`'s `Inner`, which can be extracted via ["infer types"](infer.md)), via an underlying SDK (e.g. `near-api-js`), or by some other means and pass it in as a parameter to the functions in `ChainInterface` as you need the functionality.

## Usage

With the number of type parameters, this interface might be a little scary, but luckily the individual parameters should almost never need to be used. That said, the steps for using these interfaces are:

1. include the `@baf-wallet` libraries of every chain you want to use as a peer dependency. For example, if you wanted to use NEAR Protocol, you'd add `@baf-wallet/near`.
2. call `getWrappedInterface<ChainInterfaceOfChainYouWantToUse>` or `getChainInterface<ChainInterfaceOfChainYouWantToUse>` to get a `WrappedChainInterface` or `WrappedInterface` respectively.
3. Use the methods provided by `getWrappedInterface` and `getChainInterface` respectively to do literally whatever you want.

### NEAR Protocol Example

```ts
import { WrappedChainInterface, Chain } from "@baf-wallet/interfaces";
import { getWrappedInterfaces } from "@baf-wallet/multi-chain";
import { NearChainInterface, NEP141Contract } from "@baf-wallet/near";

(async () => {
  const near = await getWrappedChainInterface<NearChainInterface>(chain.NEAR);
  // go nuts, eg
  const callerAccount = near.accounts.getGenericMasterAccount();
  const tokenContract = await chainInterface
    .getContract<NEP141Contract>("ft.levtester.tesnet")
    .init({
      callerAccount,
      viewMethods: ["ft_balance_of"],
      changeMethods: [],
    });

  const balance = await tokenContract.ft_balance_of({ account_id: "someone.tesnet" }):
})()

```

### non-wrapped `ChainInterface` example

```ts
import { WrappedChainInterface, Chain } from "@baf-wallet/interfaces";
import { getWrappedInterfaces } from "@baf-wallet/multi-chain";
import { NearChainInterface, NEP141Contract } from "@baf-wallet/near";

// Let's imagine I was writing an application where I want to separate the "state" of the connection to the blockchain from the functionality itself.
// For many "object-oriented" SDK's, you can't do that, because, well, they're "object-oriented".
// By doing this with the un-wrapped chain interface, I can do the following:

// in global scope, do this exactly once
const chainInterface = getChainInterface<NearChainInterface>(chain.NEAR);

    // ... in some async function where you want a different configuration, or maybe you just don't have access the single instance from before, or maybe you're trying to do something clever
async function foo(params: InferInitParams<NearChainInterface>>) {
  const nearState = chainInterface.init(params);
  const accounts = chainInterface.accounts(nearState);

  // do stuff with AccountsInterface
  const callerAccount = accounts.getGenericMasterAccount();

  // pass the state into getContract
  const tokenContract = await chainInterface
    .getContract<NEP141Contract>(nearState, "ft.levtester.testnet")
    .init({
      callerAccount,
      viewMethods: ["ft_balance_of"],
      changeMethods: []
    });

  const balance = await tokenContract.ft_balance_of({ account_id: "someone.tesnet" });
}
```
