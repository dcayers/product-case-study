import { FullOrder } from "@/types";

export const sumProductPrice = (products: FullOrder["products"]) => {
  if (products.length === 0) return 0;

  let totalPrice = 0;

  for (const product of products) {
    totalPrice += product.product.price;
  }

  return totalPrice;
};
