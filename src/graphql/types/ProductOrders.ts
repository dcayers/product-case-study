import { builder } from "../builder";

builder.prismaObject("ProductOrders", {
  fields: (t) => ({
    product: t.relation("product"),
    // order: t.relation("order"),
    quantity: t.exposeInt("quantity"),
  }),
});
