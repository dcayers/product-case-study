"use client";
import { Table } from "@mantine/core";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { formatDate, toServerDate } from "@/lib/helpers/formatDate";
import { Order, Product } from "@prisma/client";

interface FullOrder extends Order {
  products: Product[];
}

/**
 * NOTES
 * This component could be optimized by moving the product parsing to the backend as
 * apart of the query that returns
 */
export function OrdersTable({ orders }: { orders: FullOrder[] }) {
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Order No.</Table.Th>
          <Table.Th>Description</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Created</Table.Th>

          <Table.Th>Last Update</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {orders.map((order) => (
          <Table.Tr key={order.id}>
            <Table.Td>{order.id}</Table.Td>
            <Table.Td>{order.description}</Table.Td>
            <Table.Td>{order.status}</Table.Td>
            <Table.Td>
              {formatDate(new Date(order.createdAt!), "dd-MM-yyyy p")}
            </Table.Td>
            <Table.Td>
              {formatDistanceToNow(toServerDate(order.updatedAt!))} ago
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
