export type Pair<T, U> = {
  fst: T;
  snd: U;
};

export const getEnumValues = (enumObj: any) =>
  Object.keys(enumObj).map((key) => enumObj[key]);
