import { Order, Product } from "@prisma/client";

export interface FullOrder extends Order {
  products: Product[];
}
