import { Prisma } from "@prisma/client";

type OrderTuple = [string, number]

const orderOne: OrderTuple[] = [["1", 2], ["3", 20], ["9", 5]]
const orderTwo: OrderTuple[] = [["2", 1], ["8", 40], ["6", 15], ["9", 3]]
const orderThree: OrderTuple[] = [["4", 12], ["5", 2], ["7", 9]]

// orderOne.map(([productId, quantity]) => ({
//   productId_orderId: {
//     orderId: "1",
//     productId,
//   },
//   quantity
// }))

export const orders: Prisma.OrderUncheckedCreateInput[] = [
  {
    id: "1",
    status: "Picking",
    description: "Order One",
    products: {
      create: orderOne.map(([productId, quantity]) => ({
        product: {
          connect: {
            id: productId
          }
        },
        quantity
      }))
    }
  },
  {
    id: "2",
    status: "Received",
    description: "Order Two",
    products: {
      create: orderTwo.map(([productId, quantity]) => ({
        product: {
          connect: {
            id: productId
          }
        },
        quantity
      }))
    }
  },
  {
    id: "3",
    status: "Processing",
    description: "Order Three",
    products: {
      create: orderThree.map(([productId, quantity]) => ({
        product: {
          connect: {
            id: productId
          }
        },
        quantity
      }))
    }
  },
];
