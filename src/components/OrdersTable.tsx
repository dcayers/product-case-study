"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLazyQuery, useMutation } from "@apollo/client";
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
  Pagination,
  Select,
  Box,
  LoadingOverlay,
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
import { AVAILABLE_TO_IN_TRANSIT } from "@/lib/helpers/constants";
import { generateStatusOptions } from "@/lib/helpers/generateStatusOptions";
import classes from "@/lib/theme/css/table.module.css";
import { sumProductPrice } from "@/lib/helpers/sumProductPrice";
import {
  CANCEL_ORDER_MUTATION,
  DELETE_DRAFT_ORDER_MUTATION,
  UPDATE_ORDER_STATUS_MUTATION,
} from "@/graphql/mutations";

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
  const [getOrders, { loading }] = useLazyQuery(SEARCH_ORDERS_QUERY, {
    fetchPolicy: "network-only",
  });
  const [updateOrderStatus, { loading: updateStatusLoading }] = useMutation(
    UPDATE_ORDER_STATUS_MUTATION
  );
  const [deleteDraftOrder, { loading: deleteDraftLoading }] = useMutation(
    DELETE_DRAFT_ORDER_MUTATION
  );
  const [cancelOrder, { loading: cancelOrderLoading }] = useMutation(
    CANCEL_ORDER_MUTATION
  );

  useEffect(() => {
    const sortBy: Record<string, boolean> = {};

    if (sortByField) {
      sortBy[sortByField] = shouldReverseSort;
    }

    const isMutationLoading =
      updateStatusLoading || deleteDraftLoading || cancelOrderLoading;

    if (debouncedSearch !== null || sortByField || isMutationLoading) {
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
  }, [
    getOrders,
    sortByField,
    shouldReverseSort,
    debouncedSearch,
    updateStatusLoading,
    deleteDraftLoading,
    cancelOrderLoading,
  ]);

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
      <Box pos="relative">
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Order No.</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Items/Total</Table.Th>
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
                <Table.Td>
                  {order.products.length} prod / $
                  {sumProductPrice(order.products)}
                </Table.Td>
                <Table.Td w="12rem">
                  {formatDate(new Date(order.createdAt!), "dd-MM-yyyy p")}
                </Table.Td>
                <Table.Td w="12rem">
                  {formatDistanceToNow(toServerDate(order.updatedAt!))} ago
                </Table.Td>
                <Table.Td maw="9rem">
                  <Select
                    maw={"12rem"}
                    value={order.status}
                    data={generateStatusOptions(order.status)}
                    disabled={["Draft", "Cancelled"].includes(order.status)}
                    onChange={(value) => {
                      updateOrderStatus({
                        variables: {
                          orderNo: order.orderNo,
                          status: value,
                        },
                      });
                    }}
                  />
                </Table.Td>
                <Table.Td>
                  <Group>
                    <ActionIcon
                      variant="subtle"
                      size="lg"
                      aria-label={`Edit Order ${order.orderNo}`}
                      loaderProps={{ type: "dots" }}
                      component={Link}
                      href={`/order/${order.orderNo}/edit`}
                      disabled={order.status === "Cancelled"}
                    >
                      <IconPencil />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      size="lg"
                      aria-label="Add Tracking Details"
                      component={Link}
                      href={`/order/${order.orderNo}/tracking`}
                      disabled={!AVAILABLE_TO_IN_TRANSIT.includes(order.status)}
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
                        onClick={() => {
                          deleteDraftOrder({
                            variables: {
                              orderNo: order.orderNo,
                            },
                          });
                        }}
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
                        onClick={() => {
                          cancelOrder({
                            variables: {
                              orderNo: order.orderNo,
                            },
                          });
                        }}
                        disabled={order.status === "Cancelled"}
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
      </Box>

      <Center>
        <Pagination total={20} siblings={1} defaultValue={1} />
      </Center>
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
