"use client";
import { useRouter } from "next/navigation";
import { useForm, hasLength } from "@mantine/form";
import { Text, Button, Group, TextInput, Box, Flex } from "@mantine/core";

export function TrackingForm({ orderId }: { orderId?: string }) {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      trackingCompany: "",
      trackingNumber: "",
    },

    validate: {
      trackingCompany: hasLength(
        { min: 2, max: 100 },
        "Tracking Company must be 2-100 characters long"
      ),
    },
  });

  return (
    <Box
      component="form"
      onSubmit={form.onSubmit((data) => {
        console.log(data);
      })}
      autoComplete="off"
    >
      <Flex direction="column" gap="sm">
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

      <Group justify="flex-end" mt="md">
        <Button color="red" variant="default" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </Group>
    </Box>
  );
}
