import { OrderStatus, PrismaClient } from "@prisma/client";
import { products } from "../src/fixtures/products";
import { orders } from "../src/fixtures/orders";

const prisma = new PrismaClient();

async function main() {
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
      status: "Draft" as OrderStatus
    }
  })
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
