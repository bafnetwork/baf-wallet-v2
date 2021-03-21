import type * as BN from "bn.js";

export interface KeyState {
  pubkey: string,
  privkey: string
}

export interface Balance {
  tok: TOKEN,
  balance: string | BN | number
}

export enum TOKEN {
  Near = "Near",
  Eth = "Eth"
}

