import { Order, Product, ShippingInfo } from "@prisma/client";

export interface FullOrder extends Order {
  products: Product[];
  shipping: ShippingInfo;
}
