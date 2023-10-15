"use client";
import { useRouter } from "next/navigation";
import { useForm, hasLength, isNotEmpty } from "@mantine/form";
import { Text, Button, Group, TextInput, Box, Flex } from "@mantine/core";
import { ShippingInfo } from "@prisma/client";
import { useMutation } from "@apollo/client";
import { UPDATE_TRACKING_DETAILS_MUTATION } from "@/graphql/mutations";
import { AVAILABLE_TO_IN_TRANSIT } from "@/lib/helpers/constants";

export function TrackingForm({
  orderNo,
  status,
  shipping,
}: {
  orderNo?: string;
  status: string;
  shipping?: ShippingInfo;
}) {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      trackingCompany: shipping?.trackingCompany ?? "",
      trackingNumber: shipping?.trackingNumber ?? "",
    },

    validate: {
      trackingCompany: hasLength(
        { min: 2, max: 100 },
        "Tracking Company must be 2-100 characters long"
      ),
      trackingNumber: isNotEmpty("Tracking Number is required"),
    },
  });

  const [updateTrackingDetails] = useMutation(UPDATE_TRACKING_DETAILS_MUTATION);

  return (
    <Box
      component="form"
      onSubmit={form.onSubmit(async (data) => {
        const res = await updateTrackingDetails({
          variables: {
            input: {
              orderNo: orderNo,
              ...data,
            },
          },
        });

        router.back();
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
        <Button
          type="submit"
          disabled={!AVAILABLE_TO_IN_TRANSIT.includes(status)}
        >
          Save
        </Button>
      </Group>
    </Box>
  );
}
