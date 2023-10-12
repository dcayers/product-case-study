import { Prisma } from "@prisma/client";
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

const DEFAULT_PAGE_SIZE = 10;

builder.queryField("getProducts", (t) =>
  t.prismaField({
    type: ["Product"],
    args: {
      search: t.arg.string(),
      take: t.arg.int(),
      skip: t.arg.int(),
    },
    resolve: async (query, _parent, args) => {
      if (args.search) {
        const searchTerms = args.search?.replace(/\s/g, " | ");
        return prisma.product.findMany({
          ...query,
          take: args.take ?? DEFAULT_PAGE_SIZE,
          skip: args.skip ?? 0,
          where: {
            OR: [
              { description: { search: searchTerms } },
              { name: { search: searchTerms } },
            ],
          },
        });
      }

      return prisma.product.findMany({ ...query });
    },
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
