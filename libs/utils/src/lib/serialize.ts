export const serializeData = (data: any) =>
  JSON.stringify(data);
// TODO: type checking
export const deserializeData = <T>(uriEncoded: string) =>
  JSON.parse(uriEncoded) as T;
