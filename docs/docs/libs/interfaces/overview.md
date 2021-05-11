---
sidebar_position: 1
---

# Overview

To truly deliver on its goal, BAF Wallet needs to be capable of supporting all L1s, cryptographic key types, key storage mechanisms, other networks, and more. They all have their own SDK's that all expose entirely different interfaces making all kinds of assumptions about how they are most likely to be used - which means that actually integrating multiple of them into a project is a complete and total mess requiring the reconciliation of conflicting dependencies, side effecets, elliptic curves, protocols, assumptions, etc. But since BAF Wallet's top priority as far

In order to stay sane and productive when integrating many blockchains into a single project, we need to be able to decouple each integration from core wallet functionality as much as possible. Every chain worth integrating has its own SDK, which we should use in order to avoid re-inventing wheels. However, a separate SDK for each chain means separate types and interfaces for public keys, secret keys, key pairs, RPC calls, transactions, transaction signing, transaction sending, accounts, account metadata, and more, not to mention the fact that they are often object-orented and thus _stateful_, each in their own particular way. To not isolate all of this from our core functionality would quickly result in an epidemic of fugly code that's incredibly difficult to work with spreading across the BAF Wallet codebase.

In order to do this, we need some well-chosen unifying types and interfaces that abstract over the specific chain implementations - this is the purpose of `@baf-wallet/interfaces`.

## List of types

- [`ChainInterface` and `WrappedChainInterface`](chain_interface.md)
- ["Infer types"](infer_types.md)
- [`KeyPair`, `PublicKey`, `SecretKey`, and elliptic curve markers](key_pairs.md)
- [`GenericTx` and related types](tx.md)
