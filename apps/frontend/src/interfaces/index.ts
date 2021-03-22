export interface KeyState {
  pubkey: string,
  privkey: string
}

export interface Balance {
  tok: TOKEN,
  balance: string | number
}

export enum TOKEN {
  Near = "Near",
  Eth = "Eth"
}
