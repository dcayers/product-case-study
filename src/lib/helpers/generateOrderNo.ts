import { customAlphabet } from "nanoid";

export const generateOrderNo = () => {
  const nanoid = customAlphabet("1234567890abcdef", 6);
  return `PCS-${nanoid}`.toUpperCase();
};
