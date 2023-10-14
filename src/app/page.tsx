import Link from "next/link";
import { Flex, Button } from "@mantine/core";
import { IconBarcode, IconPhoto } from "@tabler/icons-react";
import { OrdersTable } from "@/components/OrdersTable";
import { getClient } from "@/lib/apolloClient";
import { ORDERS_QUERY } from "@/graphql/queries";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { data } = await getClient().query({
    query: ORDERS_QUERY,
    fetchPolicy: "no-cache",
  });

  return (
    <Flex direction="column" gap="md">
      <Flex align="center" justify="space-between">
        <h2>Manage Orders</h2>
        <Flex gap={16}>
          <Button
            variant="light"
            color="pcsPurple"
            leftSection={<IconBarcode size={14} />}
            component={Link}
            href="/products"
            prefetch={false}
          >
            Manage Products
          </Button>
          <Button
            variant="light"
            leftSection={<IconPhoto size={14} />}
            component={Link}
            href="/order/new"
            prefetch={false}
          >
            New Order
          </Button>
        </Flex>
      </Flex>
      <OrdersTable orders={data.orders} />
    </Flex>
  );
}
