import { Order, Product, ShippingInfo } from "@prisma/client";

export interface FullOrder extends Order {
  products: {
    quantity: number;
    product: Product;
  }[];
  shipping: ShippingInfo;
}

declare global {
  /**
   * Sets everything to optional except for the provided keys
   */
  type PartialWithRequired<T, K extends keyof T> = Pick<T, K> & Partial<T>;

  /**
   * Pretty print all the ugly types 💅
   */
  type PrettyPrint<T> = {
    [K in keyof T]: T[K];
  } & {};
}
