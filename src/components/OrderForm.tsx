"use client";
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
  NumberInput,
  Box,
  Flex,
  Tabs,
  ScrollArea,
  Center,
} from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { usePlacesWidget } from "react-google-autocomplete";
import { ProductAdder } from "./ProductAdder";

export function OrderForm({ orderId }: { orderId?: string }) {
  const form = useForm({
    initialValues: {
      description: "",
      deliveryAddress: "",
      contactName: "",
      contactNumber: "",
      contactEmail: "",
      trackingCompany: "",
      trackingNumber: "",
      items: [{ name: "", quantity: 1, key: randomId() }],
    },

    validate: {
      description: hasLength(
        { min: 2, max: 1000 },
        "Name must be 2-10 characters long"
      ),
    },
  });

  const { ref } = usePlacesWidget<HTMLInputElement>({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
    onPlaceSelected: (place) => {
      console.log(place);
    },
  });

  return (
    <Box component="form" onSubmit={form.onSubmit((data) => {
      console.log(data)
    })} autoComplete="off">
      <Tabs
        defaultValue="order"
        style={{
          minHeight: "780px",
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
            <Text size="xl">Tracking Details</Text>
            <TextInput
              label="Tracking Company"
              placeholder="Tracking Company"
              withAsterisk
              autoComplete="new-company"
              {...form.getInputProps("trackingCompany")}
            />
            <TextInput
              label="Tracking Number"
              placeholder="Tracking Number"
              withAsterisk
              autoComplete="new-tracking-number"
              {...form.getInputProps("trackingNumber")}
            />
          </Flex>
        </Tabs.Panel>
        <Tabs.Panel value="items" p={12}>
          <Text size="xl" mb={16}>Items</Text>
          <ScrollArea>
            <Flex direction="column" gap={16}>
              {
                form.values.items.map((item, index) => (
                  <ProductAdder
                    onAdd={(value, quantity) => {
                      console.log(value, quantity);
                    }}
                    onRemoveClick={() => {
                      form.removeListItem('items', index)
                    }}
                    key={item.key}
                  />

                ))
              }
            </Flex>
          </ScrollArea>
            <Center mt={16}>
              <Button
                onClick={() =>
                  form.insertListItem("items", {
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
        <Button>Cancel</Button>
        <Button type="submit">Save</Button>
      </Group>
    </Box>
  );
}
