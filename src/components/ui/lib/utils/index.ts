export const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const objCopy = { ...obj };

  keys.forEach((key) => {
    delete objCopy[key];
  });

  return objCopy;
};