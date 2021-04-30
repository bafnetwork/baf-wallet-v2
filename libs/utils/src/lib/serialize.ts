export const serializeData = (data: any) => JSON.stringify(data);
// TODO: add type checking. See https://github.com/bafnetwork/baf-wallet-v2/issues/36
export const deserializeData = <T>(uriEncoded: string) =>
  JSON.parse(uriEncoded) as T;
