import { OrderStatus } from "@prisma/client";
import { builder } from "../builder";

builder.prismaObject("Order", {
  fields: (t) => ({
    id: t.exposeID("id"),
    status: t.expose("status", { type: Status }),
    description: t.exposeString("description", { nullable: true }),
    products: t.relation("products", { nullable: true }),
    shipping: t.relation("shipping", { nullable: true }),
    shippingInfoId: t.exposeString("shippingInfoId", { nullable: true }),
    createdAt: t.expose("createdAt", { type: "Date", nullable: true }),
    updatedAt: t.expose("updatedAt", { type: "Date", nullable: true }),
    productsInOrder: t.relationCount("products"),
  }),
});

const Status = builder.enumType("OrderStatus", {
  values: [
    "Draft",
    "Received",
    "Picking",
    "Processing",
    "InTransit",
    "Delayed",
    "Delivered",
    "Cancelled",
  ],
});

builder.queryField("orders", (t) =>
  t.prismaField({
    type: ["Order"],
    resolve: (query) => prisma.order.findMany({ ...query }),
  })
);

builder.mutationField("createDraftOrder", (t) =>
  t.prismaField({
    type: "Order",
    resolve: async () => {
      return prisma.order.create({});
    },
  })
);

builder.mutationField("addProductToOrder", (t) =>
  t.prismaField({
    type: "Order",
    args: {
      id: t.arg.string({ required: true }),
      quantity: t.arg.int({ required: true }),
      productId: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, { id, ...args }) => {
      await prisma.product.update({
        where: {
          id: args.productId,
        },
        data: {
          quantity: {
            decrement: args.quantity,
          },
        },
      });
      return prisma.order.update({
        ...query,
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
    },
  })
);

builder.mutationField("publishOrder", (t) =>
  t.prismaField({
    type: "Order",
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, { id, ...args }) => {
      return prisma.order.update({
        ...query,
        where: { id },
        data: {
          status: "Received",
        },
      });
    },
  })
);

builder.mutationField("cancelOrder", (t) =>
  t.prismaField({
    type: "Order",
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, { id, ...args }) => {
      // get products
      const orderProducts = await prisma.order.findFirst({
        select: {
          products: true,
        },
        where: {
          id,
        },
      });

      // Refund the quantities
      if (orderProducts) {
        const updatedOrders = await Promise.allSettled(
          orderProducts.products.map(({ productId, quantity }) =>
            prisma.product.update({
              where: {
                id: productId,
              },
              data: {
                quantity: {
                  increment: quantity,
                },
              },
            })
          )
        );
      }

      return prisma.order.update({
        ...query,
        where: { id },
        data: {
          status: "Cancelled",
          products: {
            deleteMany: {},
          },
        },
      });
    },
  })
);

builder.mutationField("updateOrderStatus", (t) =>
  t.prismaField({
    type: "Order",
    args: {
      id: t.arg.string({ required: true }),
      status: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, { id, ...args }) => {
      return prisma.order.update({
        ...query,
        where: { id },
        data: {
          status: args.status as OrderStatus,
        },
      });
    },
  })
);

builder.mutationField("addShippingDetails", (t) =>
  t.prismaField({
    type: "Order",
    args: {
      id: t.arg.string({ required: true }),
      trackingCompany: t.arg.string({ required: true }),
      trackingNumber: t.arg.string({ required: true }),
      deliveryAddress: t.arg.string({ required: true }),
      contactName: t.arg.string({ required: true }),
      contactNumber: t.arg.string({ required: true }),
      contactEmail: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, { id, ...args }) => {
      return prisma.order.update({
        ...query,
        where: { id },
        data: {
          shipping: {
            create: {
              ...args,
            },
          },
        },
      });
    },
  })
);

builder.mutationField("ammendShippingDetails", (t) =>
  t.prismaField({
    type: "Order",
    args: {
      id: t.arg.string({ required: true }),
      trackingCompany: t.arg.string({ required: true }),
      trackingNumber: t.arg.string({ required: true }),
      deliveryAddress: t.arg.string({ required: true }),
      contactName: t.arg.string({ required: true }),
      contactNumber: t.arg.string({ required: true }),
      contactEmail: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, { id, ...args }) => {
      return prisma.order.update({
        ...query,
        where: { id },
        data: {
          shipping: {
            update: {
              ...args,
            },
          },
        },
      });
    },
  })
);
