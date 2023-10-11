/*
  Warnings:

  - Added the required column `quantity` to the `product_orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_shippingInfoId_fkey";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "shippingInfoId" DROP NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "product" ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "product_orders" ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_shippingInfoId_fkey" FOREIGN KEY ("shippingInfoId") REFERENCES "shipping_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;
