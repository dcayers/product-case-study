/*
  Warnings:

  - A unique constraint covering the columns `[orderNo]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderNo` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "deleted" BOOLEAN DEFAULT false,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "orderNo" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'Draft';

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "deleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "shipping_info" ADD COLUMN     "deleted" BOOLEAN DEFAULT false,
ALTER COLUMN "trackingCompany" DROP NOT NULL,
ALTER COLUMN "trackingNumber" DROP NOT NULL,
ALTER COLUMN "deliveryAddress" DROP NOT NULL,
ALTER COLUMN "contactName" DROP NOT NULL,
ALTER COLUMN "contactNumber" DROP NOT NULL,
ALTER COLUMN "contactEmail" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNo_key" ON "orders"("orderNo");
