"use client";
import { useEffect, useState } from "react";
import {
  Table,
  ActionIcon,
  Group,
  TextInput,
  rem,
  Text,
  Loader,
  NumberInput,
  Box,
  Textarea,
  Flex,
  Button,
  Space,
  Transition,
  Modal,
} from "@mantine/core";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { Product } from "@prisma/client";
import { formatDate, toServerDate } from "@/lib/helpers/formatDate";
import {
  IconCheck,
  IconCurrencyDollarAustralian,
  IconEdit,
  IconEditOff,
  IconPlus,
  IconSearch,
  IconStack3,
  IconX,
} from "@tabler/icons-react";
import { SEARCH_PRODUCTS_QUERY } from "@/graphql/queries";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useLazyQuery, useMutation } from "@apollo/client";
import { hasLength, isInRange, useForm } from "@mantine/form";
import {
  CREATE_PRODUCT_MUTATION,
  UPDATE_PRODUCT_DETAILS_INLINE_MUTATION,
} from "@/graphql/mutations";

interface ProductsManagerArgs {
  initialProducts: Product[];
}

export function ProductsManager({ initialProducts }: ProductsManagerArgs) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState<string | null>(null);
  const [debouncedSearch] = useDebouncedValue(search, 200);
  const [searchProducts, { loading }] = useLazyQuery(SEARCH_PRODUCTS_QUERY);

  useEffect(() => {
    if (debouncedSearch !== null) {
      searchProducts({
        variables: {
          search: debouncedSearch,
        },
        onCompleted: (data) => {
          setProducts(data.getProducts);
        },
      });
    }
  }, [searchProducts, debouncedSearch]);

  const handleSearchChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };

  return (
    <div>
      <Flex justify="space-between">
        <TextInput
          placeholder="Search by Product Name or Description"
          mb="md"
          maw={400}
          style={{ flex: 1 }}
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
        <Flex style={{ flex: 1 }} justify="flex-end" gap={16} align="center">
          <NewProductForm
            onCreate={() => {
              searchProducts({
                variables: {
                  search: debouncedSearch,
                },
                onCompleted: (data) => {
                  setProducts(data.getProducts);
                },
              });
            }}
          />
        </Flex>
      </Flex>
      <Space h={64} />
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Qty.</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>Product Name</Table.Th>
            <Table.Th>Product Description</Table.Th>
            <Table.Th>Created</Table.Th>
            <Table.Th>Last Updated</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {products.map((product) => (
            <RowWithInlineEditor
              key={product.id}
              product={product}
              onUpdate={(onUpdateComplete) => {
                searchProducts({
                  variables: {
                    search: debouncedSearch && debouncedSearch,
                  },
                  onCompleted: (data) => {
                    setProducts(data.getProducts);
                    onUpdateComplete();
                  },
                });
              }}
            />
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
}

interface NewProductFormArgs {
  onCreate: () => void;
}

function NewProductForm({ onCreate }: NewProductFormArgs) {
  const [opened, { open, close }] = useDisclosure(false);
  const [createProduct, { loading }] = useMutation(CREATE_PRODUCT_MUTATION);

  const form = useForm({
    initialValues: {
      quantity: 1,
      price: 1,
      name: "",
      description: "",
    },
    validate: {},
  });
  return (
    <>
      <Modal opened={opened} onClose={close} title="New Product Form" centered>
        <Box
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
          component="form"
          onSubmit={form.onSubmit(async (data) => {
            createProduct({
              variables: {
                input: data,
              },
              onCompleted: () => {
                onCreate();
                close();
              },
            });
          })}
        >
          <NumberInput
            withAsterisk
            label="Quantity"
            leftSection={<IconStack3 />}
            {...form.getInputProps("quantity")}
          />
          <NumberInput
            withAsterisk
            label="Price"
            leftSection={<IconCurrencyDollarAustralian />}
            {...form.getInputProps("price")}
          />
          <Textarea
            withAsterisk
            label="Product Name"
            placeholder="Label your product"
            {...form.getInputProps("name")}
          />
          <Textarea
            withAsterisk
            label="Product Description"
            placeholder="Describe your product"
            {...form.getInputProps("description")}
          />
          <Button
            loading={loading}
            loaderProps={{ type: "bars" }}
            type="submit"
          >
            Save
          </Button>
        </Box>
      </Modal>
      <Button leftSection={<IconPlus />} onClick={open}>
        New Product
      </Button>
    </>
  );
}

interface RowWithInlineEditorArgs {
  product: Product;
  onUpdate: (onUpdateComplete: () => void) => void;
}

function RowWithInlineEditor({ product, onUpdate }: RowWithInlineEditorArgs) {
  const [isEdit, setIsEdit] = useState(false);
  const [rowDirty, setRowDirty] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const [updateInlineDetail, { loading }] = useMutation(
    UPDATE_PRODUCT_DETAILS_INLINE_MUTATION
  );

  const handleUpdate = async (field: string, value: string | number) => {
    const updatedProduct = await updateInlineDetail({
      variables: {
        id: product.id,
        field,
        value: String(value),
      },
    });

    setRowDirty(true);
  };

  const handleEditToggle = async () => {
    setIsEdit((b) => !b);
    if (rowDirty) {
      setLoadingUpdate(true);
      onUpdate(() => {
        setRowDirty(false);
        setLoadingUpdate(false);
      });
    }
  };

  return (
    <Table.Tr>
      <Table.Td width={200}>
        <Group>
          {isEdit ? (
            <InlineEditor
              field="quantity"
              type="number"
              initialValue={product.quantity}
              onUpdate={async (value) => await handleUpdate("quantity", value)}
            />
          ) : (
            product.quantity
          )}
        </Group>
      </Table.Td>
      <Table.Td width={200}>
        {isEdit ? (
          <InlineEditor
            field="price"
            type="number"
            initialValue={product.price}
            onUpdate={async (value) => await handleUpdate("price", value)}
          />
        ) : (
          `$${product.price}`
        )}
      </Table.Td>
      <Table.Td width={300}>
        {isEdit ? (
          <InlineEditor
            field="name"
            type="text"
            initialValue={product.name}
            onUpdate={async (value) => await handleUpdate("name", value)}
          />
        ) : (
          <Text lineClamp={1}>{product.name}</Text>
        )}
      </Table.Td>
      <Table.Td>
        {isEdit ? (
          <InlineEditor
            field="description"
            type="text"
            initialValue={product.description}
            onUpdate={async (value) => await handleUpdate("description", value)}
          />
        ) : (
          <Text lineClamp={1}>{product.description}</Text>
        )}
      </Table.Td>
      <Table.Td width={200}>
        {formatDate(new Date(product.createdAt!), "dd-MM-yyyy p")}
      </Table.Td>
      <Table.Td width={200}>
        {formatDistanceToNow(toServerDate(product.updatedAt!))} ago
      </Table.Td>
      <Table.Td align="left">
        <ActionIcon
          c="pcsPurple"
          size="lg"
          variant="subtle"
          onClick={handleEditToggle}
          loading={loadingUpdate}
          loaderProps={{ type: "dots" }}
          aria-label={`${isEdit ? "Stop editing" : "Edit"} product ${
            product.name
          }`}
        >
          {isEdit ? <IconEditOff /> : <IconEdit />}
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  );
}

function InlineEditor({
  field,
  type,
  initialValue,
  onUpdate,
}: {
  field: string;
  onUpdate: (value: string | number) => void;
  multiline?: boolean;
} & (
  | { type: "text"; initialValue: string; onUpdate: (value: string) => void }
  | { type: "number"; initialValue: number; onUpdate: (value: number) => void }
)) {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      value: initialValue,
    },
    validate: {
      value:
        type === "text"
          ? hasLength(
              { min: 2, max: 1000 },
              "Name must be 2-10 characters long"
            )
          : isInRange({ min: 1 }, "Value must be 1 or more"),
    },
  });

  return (
    <Box
      component="form"
      onSubmit={form.onSubmit(async ({ value }) => {
        setLoading(true);
        await onUpdate(value);
        setLoading(false);
      })}
    >
      <Group>
        {type === "text" ? (
          <Textarea
            style={{ flex: 1 }}
            leftSection={
              form.isDirty() && (
                <Group gap={0}>
                  <ActionIcon
                    variant="subtle"
                    color="green"
                    aria-label={`Save changes to product ${field}`}
                    loading={loading}
                    loaderProps={{ type: "dots" }}
                    type="submit"
                  >
                    <IconCheck />
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    aria-label={`Cancel changes to product ${field}`}
                    loading={loading}
                    loaderProps={{ type: "dots" }}
                    onClick={() => {
                      form.setFieldValue("value", initialValue);
                    }}
                  >
                    <IconX />
                  </ActionIcon>
                </Group>
              )
            }
            {...form.getInputProps("value")}
          />
        ) : (
          <NumberInput
            style={{ flex: 1, height: 56 }}
            min={1}
            leftSection={
              form.isDirty() && (
                <Group grow gap={0} style={{ right: "1.25rem" }}>
                  <ActionIcon
                    variant="subtle"
                    color="green"
                    aria-label={`Save changes to product ${field}`}
                    loading={loading}
                    loaderProps={{ type: "dots" }}
                    type="submit"
                  >
                    <IconCheck />
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    aria-label={`Cancel changes to product ${field}`}
                    loading={loading}
                    loaderProps={{ type: "dots" }}
                    onClick={() => {
                      form.setFieldValue("value", initialValue);
                    }}
                  >
                    <IconX />
                  </ActionIcon>
                </Group>
              )
            }
            {...form.getInputProps("value")}
          />
        )}
      </Group>
    </Box>
  );
}
