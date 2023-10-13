import { OrderStatus } from "@prisma/client";
import { generateOrderNo } from "@/lib/helpers/generateOrderNo";
import { builder } from "../builder";

builder.prismaObject("Order", {
  fields: (t) => ({
    id: t.exposeID("id"),
    orderNo: t.exposeString("orderNo"),
    status: t.expose("status", { type: Status }),
    description: t.exposeString("description", { nullable: true }),
    products: t.relation("products", { nullable: true }),
    shipping: t.relation("shipping", { nullable: true }),
    shippingInfoId: t.exposeString("shippingInfoId", { nullable: true }),
    createdAt: t.expose("createdAt", { type: "Date", nullable: true }),
    updatedAt: t.expose("updatedAt", { type: "Date", nullable: true }),
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
    resolve: (query) =>
      prisma.order.findMany({ ...query, where: { deleted: false } }),
  })
);

builder.queryField("getOrderByOrderNumber", (t) =>
  t.prismaField({
    type: "Order",
    args: {
      orderNo: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, { orderNo }) => {
      return prisma.order.findUniqueOrThrow({
        ...query,
        where: {
          orderNo,
        },
      });
    },
  })
);

builder.mutationField("createDraftOrder", (t) =>
  t.prismaField({
    type: "Order",
    resolve: async () => {
      return prisma.order.create({
        data: {
          orderNo: generateOrderNo(),
          shipping: {
            create: {},
          },
        },
      });
    },
  })
);

const UpdateOrderInput = builder.inputType("UpdateOrderInput", {
  fields: (t) => ({
    orderNo: t.string({ required: true }),
    description: t.string({ required: true }),
    deliveryAddress: t.string(),
    contactName: t.string(),
    contactNumber: t.string(),
    contactEmail: t.string(),
  }),
});

builder.mutationField("updateDraftOrder", (t) =>
  t.prismaField({
    type: "Order",
    args: {
      input: t.arg({ type: UpdateOrderInput, required: true }),
    },
    resolve: async (
      query,
      _parent,
      { input: { orderNo, description, ...shippingDetails } }
    ) => {
      return prisma.order.update({
        ...query,
        where: {
          orderNo,
        },
        data: {
          description,
          shipping: {
            update: {
              ...shippingDetails,
            },
          },
        },
      });
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

builder.mutationField("deleteDraftOrder", (t) =>
  t.prismaField({
    type: "Order",
    args: {
      orderNo: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, { orderNo }) => {
      return prisma.order.update({
        ...query,
        where: { orderNo },
        data: {
          deleted: true,
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

builder.mutationField("addTrackingDetails", (t) =>
  t.prismaField({
    type: "Order",
    args: {
      id: t.arg.string({ required: true }),
      trackingCompany: t.arg.string({ required: true }),
      trackingNumber: t.arg.string({ required: true }),
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

builder.mutationField("ammendShippingDetails", (t) =>
  t.prismaField({
    type: "Order",
    args: {
      id: t.arg.string({ required: true }),
      trackingCompany: t.arg.string({ required: true }),
      trackingNumber: t.arg.string({ required: true }),
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
