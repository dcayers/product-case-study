import { customAlphabet } from "nanoid";

export const generateProductNo = () => {
  const nanoid = customAlphabet("1234567890abcdef", 6);
  return `PD-${nanoid()}`.toUpperCase();
};
