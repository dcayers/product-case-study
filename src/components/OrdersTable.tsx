"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLazyQuery } from "@apollo/client";
import {
  Table,
  ActionIcon,
  Group,
  TextInput,
  rem,
  Center,
  UnstyledButton,
  Text,
  Loader,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import {
  IconTruckDelivery,
  IconPencil,
  IconBan,
  IconTrash,
  IconSearch,
  IconX,
  IconChevronDown,
  IconChevronUp,
  IconSelector,
  IconAlertTriangle,
} from "@tabler/icons-react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { formatDate, toServerDate } from "@/lib/helpers/formatDate";
import { FullOrder } from "@/types";
import { SEARCH_ORDERS_QUERY } from "@/graphql/queries";
import classes from "@/lib/theme/css/table.module.css";

export function OrdersTable({
  orders: initialOrders,
}: {
  orders: FullOrder[];
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState<string | null>(null);
  const [sortByField, setSortByField] = useState<string | null>(null);
  const [shouldReverseSort, setSortReversal] = useState(false);
  const [debouncedSearch] = useDebouncedValue(search, 200);
  const [getOrders, { loading }] = useLazyQuery(SEARCH_ORDERS_QUERY);

  useEffect(() => {
    const sortBy: Record<string, boolean> = {};

    if (sortByField) {
      sortBy[sortByField] = shouldReverseSort;
    }

    if (debouncedSearch !== null || sortByField) {
      if (!sortByField) {
        sortBy["sortUpdated"] = false;
      }
      getOrders({
        variables: {
          input: {
            search: debouncedSearch,
            ...sortBy,
          },
        },
        onCompleted: (data) => {
          setOrders(data.orders);
        },
      });
    }
  }, [getOrders, sortByField, shouldReverseSort, debouncedSearch]);

  const handleSearchChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };

  const handleSortChange = async (field: string) => {
    const reversed = field === sortByField ? !shouldReverseSort : false;
    setSortByField(field);
    setSortReversal(reversed);
  };

  return (
    <>
      <TextInput
        placeholder="Search by Order Number or Description"
        mb="md"
        maw={400}
        leftSection={
          loading ? (
            <Loader size="xs" />
          ) : (
            <IconSearch
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          )
        }
        rightSection={<IconX />}
        rightSectionProps={{
          onClick: () => {
            setSearch("");
          },
          role: "button",
          "aria-description": "Clear search",
          style: { cursor: "pointer" },
          tabIndex: 0,
        }}
        value={search ?? ""}
        onChange={handleSearchChange}
      />
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Order No.</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Item Count</Table.Th>
            <SortableHeader
              sorted={sortByField === "sortCreated"}
              reversed={shouldReverseSort}
              onSort={() => handleSortChange("sortCreated")}
            >
              Created
            </SortableHeader>
            <SortableHeader
              sorted={sortByField === "sortUpdated"}
              reversed={shouldReverseSort}
              onSort={() => handleSortChange("sortUpdated")}
            >
              Last Updated
            </SortableHeader>
            <SortableHeader
              sorted={sortByField === "sortStatus"}
              reversed={shouldReverseSort}
              onSort={() => handleSortChange("sortStatus")}
            >
              Status
            </SortableHeader>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {orders.map((order) => (
            <Table.Tr key={order.id}>
              <Table.Td>{order.orderNo}</Table.Td>
              <Table.Td>
                {order.description ?? (
                  <Text c="orange">
                    <IconAlertTriangle
                      size={16}
                      style={{ verticalAlign: "middle" }}
                    />{" "}
                    Unedited Draft
                  </Text>
                )}
              </Table.Td>
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
                    aria-label={`Edit Order ${order.orderNo}`}
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
                      aria-label={`Delete Order ${order.orderNo}`}
                      color="red"
                      variant="subtle"
                      radius="lg"
                    >
                      <IconTrash />
                    </ActionIcon>
                  ) : (
                    <ActionIcon
                      size="sm"
                      aria-label={`Cancel Order ${order.orderNo}`}
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
    </>
  );
}

interface SortableHeaderProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

function SortableHeader({
  children,
  reversed,
  sorted,
  onSort,
}: SortableHeaderProps) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <Table.Th>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}
