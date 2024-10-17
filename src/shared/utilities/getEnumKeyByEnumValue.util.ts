export const getEnumKeyByEnumValue = (
  enumObject: unknown,
  value: string | number,
) => {
  return Object.keys(enumObject).find(
    (_key, i) =>
      i ===
      Object.values(enumObject).findIndex((enumValue) => enumValue === value),
  );
};
