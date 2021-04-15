import { CryptoCurves } from "@baf-wallet/interfaces"

// TODO: spec out
export async function getPubkeyForUser(username: string, tag: number): Promise<string> {
  // check tag to make sure it is a 4-digit number, return a helpful error if it isn't
  // try to get the user info object from the discord api, return a helpful error if it DNE
  // use torus's `getPublicAddress` method to get the pubkey given the user ID
  return "unimplemented"
}