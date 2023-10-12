import Link from 'next/link';
import { Flex, Button, NavLink } from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";
import { OrdersTable } from "@/components/OrdersTable";
import { getClient } from "@/lib/apolloClient";
import { ORDERS_QUERY } from "@/graphql/queries";

export default async function Page() {
  const { data } = await getClient().query({ query: ORDERS_QUERY });
  console.log(data);
  return (
    <Flex direction="column" gap="md">
      <Flex align="center" justify="space-between">
        <h2>Orders</h2>
        <Button variant="light" leftSection={<IconPhoto size={14} />} component={Link} href="new">
          New Order
        </Button>
      </Flex>
      <OrdersTable orders={data.orders} />
    </Flex>
  );
}
