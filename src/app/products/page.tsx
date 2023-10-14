import Link from "next/link";
import { Flex, Breadcrumbs, Text, Anchor } from "@mantine/core";
import { getClient } from "@/lib/apolloClient";
import { SEARCH_PRODUCTS_QUERY } from "@/graphql/queries";
import { ProductsManager } from "@/components/ProductsManager";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const { data } = await getClient().query({
    query: SEARCH_PRODUCTS_QUERY,
    fetchPolicy: "no-cache",
  });
  console.log(data);
  return (
    <Flex direction="column" gap="md">
      <Flex direction="column">
        <Breadcrumbs>
          <Anchor component={Link} href="/">
            Back to orders
          </Anchor>
          <Text>Manage Products</Text>
        </Breadcrumbs>
        <h2>Manage Products</h2>
      </Flex>
      <ProductsManager initialProducts={data.getProducts} />
    </Flex>
  );
}
