"use client";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import {
  useForm,
  isNotEmpty,
  isEmail,
  isInRange,
  hasLength,
  matches,
} from "@mantine/form";
import {
  Text,
  Button,
  Group,
  TextInput,
  Textarea,
  Box,
  Flex,
  Tabs,
  ScrollArea,
  Center,
} from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { usePlacesWidget } from "react-google-autocomplete";
import { ProductAdder } from "./ProductAdder";
import { FullOrder } from "@/types";
import {
  REMOVE_PRODUCT_ORDER_MUTATION,
  UPDATE_DRAFT_ORDER,
} from "@/graphql/mutations";

export function OrderForm({
  order,
}: {
  order: PrettyPrint<PartialWithRequired<FullOrder, "id">>;
}) {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      description: order.description ?? "Draft Order " + order.orderNo,
      deliveryAddress: order.shipping?.deliveryAddress ?? "",
      contactName: order.shipping?.contactName ?? "",
      contactNumber: order.shipping?.contactNumber ?? "",
      contactEmail: order.shipping?.contactEmail ?? "",
      products:
        order.products && order.products.length > 0
          ? order.products.map(
              ({
                quantity,
                product: { id, name, quantity: productQuantity },
              }) => ({
                id,
                quantity,
                productQuantity,
                name,
                key: id,
                saved: true,
              })
            )
          : generateDefaultProduct(),
    },
    validate: {
      description: hasLength(
        { min: 2, max: 1000 },
        "Name must be 2-10 characters long"
      ),
      contactEmail: (value) =>
        (value.length > 0
          ? isEmail("Please enter a valid email")
          : null) as React.ReactNode,
    },
  });

  const { ref } = usePlacesWidget<HTMLInputElement>({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
    inputAutocompleteValue: "one-time-code",
    onPlaceSelected: (place) => {
      if (place.formatted_address) {
        form.setFieldValue("deliveryAddress", place.formatted_address);
      } else {
        form.setFieldValue("deliveryAddress", place.name);
      }
    },
  });

  const [updateDraftOrder] = useMutation(UPDATE_DRAFT_ORDER);
  const [removeProductFromOrder] = useMutation(REMOVE_PRODUCT_ORDER_MUTATION);

  return (
    <Box
      component="form"
      onSubmit={form.onSubmit(async ({ products, ...data }) => {
        const res = await updateDraftOrder({
          variables: {
            input: {
              orderNo: order.orderNo,
              ...data,
            },
          },
        });

        router.back();
      })}
      autoComplete="new"
    >
      <Tabs
        defaultValue="order"
        style={{
          minHeight: "530px",
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="order">Order</Tabs.Tab>
          <Tabs.Tab value="items">Items</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="order" p={12}>
          <Flex direction="column" gap="sm">
            <Text size="xl">Order Details</Text>
            <Textarea
              label="Order Description"
              placeholder="Description"
              withAsterisk
              {...form.getInputProps("description")}
            />
            <Text size="xl">Shipping Details</Text>
            <TextInput
              label="Delivery Address"
              placeholder="17 Forest Hills Drive, Somewhere, VIC 3000"
              ref={ref}
              autoComplete="one-time-code"
              {...form.getInputProps("deliveryAddress")}
            />
            <TextInput
              label="Contact Name"
              placeholder="Contact Name"
              withAsterisk
              autoComplete="new-name"
              {...form.getInputProps("contactName")}
            />
            <TextInput
              label="Contact Number"
              placeholder="Contact Number"
              withAsterisk
              autoComplete="new-number"
              {...form.getInputProps("contactNumber")}
            />
            <TextInput
              label="Contact Email"
              placeholder="Contact Email"
              withAsterisk
              autoComplete="new-email"
              {...form.getInputProps("contactEmail")}
            />
          </Flex>
        </Tabs.Panel>
        <Tabs.Panel value="items" p={12}>
          <Text size="xl" mb={16}>
            Items
          </Text>
          <ScrollArea>
            <Flex direction="column" gap={16}>
              {form.values.products.map((item, index) => (
                <ProductAdder
                  orderId={order.id}
                  initialProduct={item}
                  onAddClick={(product, quantity) => {
                    // add product connection
                    form.setFieldValue(`products.${index}`, {
                      ...product,
                      productQuantity: product.quantity,
                      quantity,
                      saved: true,
                    });
                    form.setFieldValue(`products.${index}.saved`, true);
                  }}
                  onProductChange={() => {
                    if (item.saved) {
                      form.setFieldValue(`products.${index}.id`, null);
                      form.setFieldValue(`products.${index}.saved`, false);
                    }
                  }}
                  onRemoveClick={async (product, quantity) => {
                    // delete connection
                    await removeProductFromOrder({
                      variables: {
                        id: order.id,
                        productId: product.id,
                        quantity,
                      },
                    });
                    if (form.values.products.length === 1) {
                      form.setFieldValue(
                        "products.0",
                        generateDefaultProduct()
                      );
                    } else {
                      form.removeListItem("products", index);
                    }
                  }}
                  key={item.key}
                />
              ))}
            </Flex>
          </ScrollArea>
          <Center mt={16}>
            <Button
              onClick={() =>
                form.insertListItem("products", {
                  saved: false,
                  name: "",
                  quantity: 1,
                  key: randomId(),
                })
              }
            >
              Add Item
            </Button>
          </Center>
        </Tabs.Panel>
      </Tabs>

      <Group justify="flex-end" mt="md">
        <Button
          color="red"
          variant="default"
          onClick={() => {
            router.back();
          }}
        >
          Close
        </Button>
        <Button type="submit" disabled={!form.isDirty()}>
          Save
        </Button>
      </Group>
    </Box>
  );
}

function generateDefaultProduct() {
  return [
    {
      id: null,
      saved: false,
      name: "",
      quantity: 1,
      key: randomId(),
    },
  ];
}
