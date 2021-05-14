export const getEnumValues = (enumObj: any) =>
  Object.keys(enumObj).map((key) => enumObj[key]);
