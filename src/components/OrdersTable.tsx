"use client";
import { Table } from "@mantine/core";

import { useQuery, gql } from "@urql/next";

const ORDERS_QUERY = gql`
  query OrdersQuery {
    orders {
      status
      updatedAt
      createdAt
      id
      products {
        product {
          createdAt
          description
          id
          name
          price
          quantity
          updatedAt
        }
        quantity
      }
    }
  }
`;

export function OrdersTable() {
  const [result] = useQuery({ query: ORDERS_QUERY });
  const { data, fetching, error } = result;

  if (fetching) return <p>Loading...</p>;
  console.log(result);
  if (error) return <p>Oh no... {error.message}</p>;
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Order No.</Table.Th>
          <Table.Th>Description</Table.Th>
          <Table.Th>Status</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>
          <Table.Td>1</Table.Td>
          <Table.Td>Random Description</Table.Td>
          <Table.Td>Pending</Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
}
