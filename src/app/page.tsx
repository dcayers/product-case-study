import { Flex } from "@mantine/core";
import { OrdersTable } from "@/components/OrdersTable";

export default async function Page() {
  return <Flex direction="column" gap="md">
    <h2>Orders</h2>
    <OrdersTable />
  </Flex>
}