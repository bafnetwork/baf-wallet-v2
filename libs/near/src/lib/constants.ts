import { ChainConstants, Env } from "@baf-wallet/interfaces";

export function getConstants(env: Env): ChainConstants {
  if (env === Env.PROD) {
    return {
      tokens: []
    }
  } else {
    return {
      tokens: [{
        contractAddress: 'ft.levtester.testnet',
      }]
    }
  }
}