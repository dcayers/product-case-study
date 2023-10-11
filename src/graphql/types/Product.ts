import { builder } from "../builder";

builder.prismaObject("Product", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    description: t.exposeString("name"),
    price: t.exposeFloat("price"),
    quantity: t.exposeInt("quantity"),
    createdAt: t.expose("createdAt", { type: "Date", nullable: true }),
    updatedAt: t.expose("updatedAt", { type: "Date", nullable: true }),
  }),
});

builder.queryField("products", (t) =>
  t.prismaField({
    type: ["Product"],
    resolve: (query) => prisma.product.findMany({ ...query }),
  })
);

builder.mutationField("createProduct", (t) =>
  t.prismaField({
    type: "Product",
    args: {
      name: t.arg.string({ required: true }),
      description: t.arg.string({ required: true }),
      price: t.arg.float({ required: true }),
      quantity: t.arg.int({ required: true }),
    },
    resolve: async (query, _parent, args) => {
      return prisma.product.create({
        ...query,
        data: {
          ...args,
        },
      });
    },
  })
);

builder.mutationField("updateProductCount", (t) =>
  t.prismaField({
    type: "Product",
    args: {
      id: t.arg.string({ required: true }),
      name: t.arg.string({ required: true }),
      description: t.arg.string({ required: true }),
      price: t.arg.float({ required: true }),
      quantity: t.arg.int({ required: true }),
    },
    resolve: async (query, _parent, { id, ...args }) => {
      return prisma.product.update({
        ...query,
        where: {
          id,
        },
        data: {
          ...args,
        },
      });
    },
  })
);
