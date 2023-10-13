"use client";
import Link from "next/link";
import { Table, ActionIcon, Group, rem } from "@mantine/core";
import {
  IconTruckDelivery,
  IconPencil,
  IconBan,
  IconTrash,
} from "@tabler/icons-react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { formatDate, toServerDate } from "@/lib/helpers/formatDate";
import { FullOrder } from "@/types";

export function OrdersTable({ orders }: { orders: FullOrder[] }) {
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Order No.</Table.Th>
          <Table.Th>Description</Table.Th>
          <Table.Th>Item Count</Table.Th>
          <Table.Th>Created</Table.Th>
          <Table.Th>Last Update</Table.Th>
          <Table.Th>Status</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {orders.map((order) => (
          <Table.Tr key={order.id}>
            <Table.Td>{order.orderNo}</Table.Td>
            <Table.Td>{order.description}</Table.Td>
            <Table.Td>{order.products.length}</Table.Td>
            <Table.Td>
              {formatDate(new Date(order.createdAt!), "dd-MM-yyyy p")}
            </Table.Td>
            <Table.Td>
              {formatDistanceToNow(toServerDate(order.updatedAt!))} ago
            </Table.Td>
            <Table.Td>{order.status}</Table.Td>
            <Table.Td>
              <Group>
                <ActionIcon
                  variant="subtle"
                  size="lg"
                  aria-label="Edit Order"
                  loaderProps={{ type: "dots" }}
                  component={Link}
                  href={`/order/${order.orderNo}/edit`}
                >
                  <IconPencil />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  size="lg"
                  aria-label="Add Tracking Details"
                  component={Link}
                  href={`/order/${order.orderNo}/tracking`}
                >
                  <IconTruckDelivery
                    style={{ width: rem(24), height: rem(24) }}
                  />
                </ActionIcon>
                {order.status === "Draft" ? (
                  <ActionIcon
                    size="sm"
                    aria-label="Delete Order"
                    color="red"
                    variant="subtle"
                    radius="lg"
                  >
                    <IconTrash />
                  </ActionIcon>
                ) : (
                  <ActionIcon
                    size="sm"
                    aria-label="Cancel Order"
                    color="red"
                    variant="subtle"
                    radius="lg"
                  >
                    <IconBan />
                  </ActionIcon>
                )}
              </Group>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
