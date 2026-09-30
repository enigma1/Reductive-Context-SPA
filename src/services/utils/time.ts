export const toISOString = (value: string): string => {
  return new Date(value).toISOString();
};
