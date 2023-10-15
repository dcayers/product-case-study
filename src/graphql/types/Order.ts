import { GraphQLError } from "graphql";
import {
  Order,
  OrderStatus,
  Prisma,
  Product,
  ShippingInfo,
} from "@prisma/client";
import { generateOrderNo } from "@/lib/helpers/generateOrderNo";
import { builder } from "../builder";
import { generateSearchString } from "@/lib/helpers/generateSearchString";
import { AVAILABLE_TO_IN_TRANSIT } from "@/lib/helpers/constants";

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
    "Cancelled",
    "Delayed",
    "Delivered",
    "Draft",
    "InTransit",
    "Picked",
    "Picking",
    "Processing",
    "Received",
  ],
});

const SearchOrderInput = builder.inputType("SearchOrderInput", {
  fields: (t) => ({
    search: t.string(),
    sortCreated: t.boolean(),
    sortUpdated: t.boolean(),
    sortStatus: t.boolean(),
  }),
});

builder.queryField("orders", (t) =>
  t.prismaField({
    type: ["Order"],
    args: {
      input: t.arg({ type: SearchOrderInput }),
    },
    resolve: (query, _parent, args) => {
      const where: Prisma.OrderFindManyArgs["where"] = { deleted: false };

      let orderBy: Record<string, any> = {};

      if (args.input) {
        if (args.input.search) {
          const searchTerms = generateSearchString(args.input.search);
          where.OR = [
            { description: { search: searchTerms } },
            { orderNo: { search: searchTerms } },
          ];
        }

        const orderByFields = new Map([
          ["createdAt", args.input.sortCreated],
          ["updatedAt", args.input.sortUpdated],
          ["status", args.input.sortStatus],
        ]);

        for (let [key, value] of orderByFields) {
          if (value !== undefined) {
            orderBy["orderBy"] = {
              [key]: value ? "asc" : "desc",
            };
            break;
          }
        }

        return prisma.order.findMany({
          ...query,
          where,
          ...orderBy,
        });
      }

      return prisma.order.findMany({
        ...query,
        where,
        orderBy: {
          updatedAt: "desc",
        },
      });
    },
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
          deleted: false,
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
      // TODO: Type this thing
      let shipping: { shipping?: any } = {};

      if (shippingDetails) {
        shipping.shipping = {
          update: {
            ...shippingDetails,
          },
        };
      }
      return prisma.order.update({
        ...query,
        where: {
          orderNo,
          deleted: false,
        },
        data: {
          description,
          ...shipping,
        },
      });
    },
  })
);

builder.mutationField("publishOrder", (t) =>
  t.prismaField({
    type: "Order",
    args: {
      orderNo: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, { orderNo }) => {
      //TODO: Check that the order has all the details it needs.

      return prisma.order.update({
        ...query,
        where: { orderNo, deleted: false },
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
        where: { orderNo, deleted: false, status: "Draft" },
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
      orderNo: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, { orderNo, ...args }) => {
      // get products
      const orderProducts = await prisma.order.findFirst({
        select: {
          products: true,
        },
        where: {
          orderNo,
          deleted: false,
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
        where: { orderNo, deleted: false },
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
      orderNo: t.arg.string({ required: true }),
      status: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, { orderNo, status }) => {
      return prisma.order.update({
        ...query,
        where: { orderNo, deleted: false },
        data: {
          status: status as OrderStatus,
        },
      });
    },
  })
);

const UpdateTrackingDetailsInput = builder.inputType(
  "UpdateTrackingDetailsInput",
  {
    fields: (t) => ({
      orderNo: t.string({ required: true }),
      trackingCompany: t.string({ required: true }),
      trackingNumber: t.string({ required: true }),
    }),
  }
);

builder.mutationField("udpateTrackingDetails", (t) =>
  t.prismaField({
    type: "Order",
    args: {
      input: t.arg({ type: UpdateTrackingDetailsInput, required: true }),
    },
    resolve: async (query, _parent, { input: { orderNo, ...args } }) => {
      if (orderNo === "PCS-TEST01") {
        throw new GraphQLError("PCS-TEST01 blocked from transit");
      }
      const order = await prisma.order.findUnique({
        where: {
          orderNo,
          deleted: false,
        },
      });

      // TODO: Throw error if order not in desired state
      if (!AVAILABLE_TO_IN_TRANSIT.includes(order?.status ?? "")) {
        throw new GraphQLError(
          `Cannot transition to InTransit from ${order?.status}`
        );
      }

      return prisma.order.update({
        ...query,
        where: { orderNo, deleted: false },
        data: {
          status: "InTransit",
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

builder.mutationField("removeProductFromOrder", (t) =>
  t.prismaField({
    type: "Order",
    args: {
      id: t.arg.string({ required: true }),
      productId: t.arg.string({ required: true }),
      quantity: t.arg.int({ required: true }),
    },
    resolve: async (query, _parent, { id, ...args }) => {
      const order = await prisma.order.update({
        ...query,
        where: { id, deleted: false },
        data: {
          products: {
            delete: {
              productId_orderId: {
                productId: args.productId,
                orderId: id,
              },
            },
          },
        },
      });
      await prisma.product.update({
        where: {
          id: args.productId,
        },
        data: {
          quantity: {
            increment: args.quantity,
          },
        },
      });

      return order;
    },
  })
);
