/**
 * standardize interface / type naming
 */
export const format = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const base = (s: string) => `Base${format(s)}`;
export const collection = (s: string) => `${format(s)}Collection`;
export const id = (s: string) => `${format(s)}Id`;
export const document = format;
