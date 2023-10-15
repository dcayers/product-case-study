import { generateProductNo } from "@/lib/helpers/generateProductNo";
import { builder } from "../builder";
import { generateSearchString } from "@/lib/helpers/generateSearchString";

builder.prismaObject("Product", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    description: t.exposeString("description"),
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
        const searchTerms = generateSearchString(args.search);
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
          orderBy: { updatedAt: "desc" },
        });
      }

      return prisma.product.findMany({
        ...query,
        orderBy: { updatedAt: "desc" },
      });
    },
  })
);

const CreateProductInput = builder.inputType("CreateProductInput", {
  fields: (t) => ({
    name: t.string({ required: true }),
    description: t.string({ required: true }),
    price: t.int({ required: true }),
    quantity: t.int({ required: true }),
  }),
});

builder.mutationField("createProduct", (t) =>
  t.prismaField({
    type: "Product",
    args: {
      input: t.arg({ type: CreateProductInput, required: true }),
    },
    resolve: async (query, _parent, args) => {
      return prisma.product.create({
        ...query,
        data: {
          ...args.input,
          productNo: generateProductNo(),
        },
      });
    },
  })
);

builder.mutationField("updateProductDetailsInline", (t) =>
  t.prismaField({
    type: "Product",
    args: {
      id: t.arg.string({ required: true }),
      field: t.arg.string({ required: true }),
      value: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, { id, field, value }) => {
      let v: string | number = value;
      if (["quantity", "price"].includes(field)) {
        v = parseInt(value);
      }
      return prisma.product.update({
        ...query,
        where: {
          id,
        },
        data: {
          [field]: v,
        },
      });
    },
  })
);

builder.mutationField("addProductToOrder", (t) =>
  t.prismaField({
    type: "Product",
    args: {
      id: t.arg.string({ required: true }),
      quantity: t.arg.int({ required: true }),
      productId: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, { id, ...args }) => {
      const product = await prisma.product.update({
        ...query,
        where: {
          id: args.productId,
        },
        data: {
          quantity: {
            decrement: args.quantity,
          },
        },
      });
      await prisma.order.update({
        where: { id },
        data: {
          products: {
            create: {
              quantity: args.quantity,
              product: {
                connect: {
                  id: args.productId,
                },
              },
            },
          },
        },
      });
      return product;
    },
  })
);
