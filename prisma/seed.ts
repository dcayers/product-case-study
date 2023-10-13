import { OrderStatus, PrismaClient } from "@prisma/client";
import { products } from "../src/fixtures/products";
import { orders } from "../src/fixtures/orders";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction([
    prisma.productOrders.deleteMany(),
    prisma.shippingInfo.deleteMany(),
    prisma.order.deleteMany(),
    prisma.product.deleteMany(),
  ]);
  await prisma.product.createMany({
    data: products,
  });

  for (const order of orders) {
    await prisma.order.create({
      data: order,
    });
  }

  await prisma.order.create({
    data: {
      orderNo: 'PCS-TEST04',
      status: "Draft" as OrderStatus,
      description: "Draft Order Test"
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
