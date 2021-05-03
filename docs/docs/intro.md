---
sidebar_position: 1
---

# Introduction


## Disclaimer

This project is in early stages of development. **Do not use it on any mainnet with real assets**.

## What is BAF Wallet?

BAF Wallet is, first an foremost, a crypto wallet that:

* Can be used across any blockchain
* Can use any key storage / management system
* Is at least as easy to get started with as any Web2 app

However, BAF Wallet is quickly becoming a synergestic ecosystem of libraries that make it as easy as possible to perform operations across multiple blockchains, which is something that we foresee being quite useful in a lot of different contexts.

Currently, we do not have a public demo ready yet.

## Getting Started

These are the steps to get a working instance running locally

Prerequisites: have `npm` and `near-cli` installed. 

1. `npm i` in the root of this repo
2. If you're using the API, DM Lev or Sebastien to get the development client secret
3. make a copy of `.env.example` in `apps/api/src/environments` and rename it `.env.dev`
4. populate all of the fields in `.env.dev` with non-example values
  * For near keys, find your key json file (any will do really, generate a new one if you like) - typically they are found in a `.near-credentials/default` directory, which is typically located in `$HOME` if you installed `near-cli` globally. Then use the hex part of the private key in that file, excluding the `"ed25519:"`. This must correspond to the account ID given for `NEAR_MASTER_ACCOUNT_ID`.
  * For the `DISCORD_CLIENT_ID`, use `"821890148198776874"` (quotes are important)
  * For `TORUS_VERIFIER_NAME`, use `baf wallet-discord-testnet`
  * For the client-secret, you will need to ask Lev or Sebastien. We still have yet to set up a painless way to manage these environment variables so that everyone can use their own Discord OAuth endpoint.
5. `npx nx serve+api frontend`.

For more information about the project, it's code structure / philosophy, it's various libraries and applications, and how to contribute, see the relevant section on the sidebar.