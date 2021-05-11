---
sidebar_position: 1
---

# Introduction

## Disclaimer

This project is in early stages of development. **Do not use it on any mainnet with real assets**.

## What is BAF Wallet?

BAF Wallet is, first an foremost, not a wallet, but _ecosystem of libraries that make it as easy as possible to develop **antimaximalist** applications and libraries_:

> antimaximalism _adj_. _1_. The perspective that there is no "one true blockchain" that places strong emphasis on knowing a lot about a lot of networks, understanding precisely what each can do, can't do, is good at, and isn't good at, and selecting the networks used to build a project based off of this knowledge. _2_. The opposite of [maximalism](https://media.consensys.net/why-is-there-maximalism-in-crypto-27967ce9025e).

In other words, it is a toolkit of libraries for building decenralized applications and libraries that:

- Can be used on multiple blockchains
- That directly builds off of multiple blockchains
- Can use any key storage / management system
- Are at least as easy to get started with as Web2 Apps
- Are chain-agnostic

Currently, there are two applications being built using the BAF Wallet libraries:

- BAF Web Wallet - a staunchly antimaximalist web wallet that integrates very nicely with pretty much anything you could ever want to integrate with it.
- BAF Wallet Discord Bot - a discord bot that integrates with the web wallet and uses BAF Wallet libraries to allow discord users to send any cryptoasset by tagging the recipient in a server where the bot is present.

Throughout the libraries, you may notice we use a lot of "fancy" types. We do this because we believe having well-typed code goes a long way towards having self-documented code, and we'd like to make `tsc` be as helpful for you as possible, especially when it comes to bug-catching and editor completions.

## Getting Started

These are the steps to get a working instance running locally

Prerequisites: have `npm` and `near-cli` installed.

1. `npm i` in the root of this repo
2. If you're using the API, DM Lev or Sebastien to get the development client secret
3. make a copy of `.env.example` in `apps/api/src/environments` and rename it `.env.dev`
4. populate all of the fields in `.env.dev` with non-example values

- For near keys, find your key json file (any will do really, generate a new one if you like) - typically they are found in a `.near-credentials/default` directory, which is typically located in `$HOME` if you installed `near-cli` globally. Then use the hex part of the private key in that file, excluding the `"ed25519:"`. This must correspond to the account ID given for `NEAR_MASTER_ACCOUNT_ID`.
- For the `DISCORD_CLIENT_ID`, use `"821890148198776874"` (quotes are important)
- For `TORUS_VERIFIER_NAME`, use `baf wallet-discord-testnet`
- For the client-secret, you will need to ask Lev or Sebastien. We still have yet to set up a painless way to manage these environment variables so that everyone can use their own Discord OAuth endpoint.

5. `npx nx serve+api frontend`.

For more information about the project, it's code structure / philosophy, it's various libraries and applications, and how to contribute, see the relevant section on the sidebar.
