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
import { UPDATE_DRAFT_ORDER } from "@/graphql/mutations";

export function OrderForm({ order }: { order: Partial<FullOrder> }) {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      description: order.description ?? "Draft Order " + order.orderNo,
      deliveryAddress: order.shipping?.deliveryAddress ?? "",
      contactName: order.shipping?.contactName ?? "",
      contactNumber: order.shipping?.contactNumber ?? "",
      contactEmail: order.shipping?.contactEmail ?? "",
      products: [{ name: "", quantity: 1, key: randomId() }],
    },

    validate: {
      description: hasLength(
        { min: 2, max: 1000 },
        "Name must be 2-10 characters long"
      ),
      contactEmail: isEmail("Please enter a valid email"),
    },
  });

  const { ref } = usePlacesWidget<HTMLInputElement>({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
    onPlaceSelected: (place) => {
      console.log(place);
      form.setFieldValue("deliveryAddress", place.formatted_address);
    },
  });

  const [updateDraftOrder] = useMutation(UPDATE_DRAFT_ORDER);

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
      autoComplete="off"
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
              autoComplete="new-street-address"
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
                  onAdd={(value, quantity) => {
                    console.log(value, quantity);
                  }}
                  onRemoveClick={() => {
                    form.removeListItem("products", index);
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
        <Button color="red" variant="default" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </Group>
    </Box>
  );
}
