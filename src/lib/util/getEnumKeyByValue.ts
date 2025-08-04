const getEnumKeyByValue = <T extends Record<string, string>>(
  enumObject: T,
  value: string | null,
): keyof T | undefined => {
  for (const key in enumObject) {
    if (Object.hasOwn(enumObject, key)) {
      if (enumObject[key] === value) {
        return key;
      }
    }
  }
  return undefined;
};

export default getEnumKeyByValue;
