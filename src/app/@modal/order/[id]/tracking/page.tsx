"use client";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { Modal, Box, LoadingOverlay } from "@mantine/core";
import { TrackingForm } from "@/components/TrackingForm";
import { ORDERS_BY_ORDER_NO_QUERY } from "@/graphql/queries";

export default function UpdateTrackingDetails({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { data, loading, error } = useQuery(ORDERS_BY_ORDER_NO_QUERY, {
    variables: {
      orderNo: params.id,
    },
    fetchPolicy: "no-cache",
  });
  return (
    <Modal
      opened={true}
      onClose={() => router.back()}
      title={
        <Box>
          Add Tracking Details Order{" "}
          {data && data.getOrderByOrderNumber.orderNo}
        </Box>
      }
      size="xl"
    >
      <Box pos="relative">
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
          loaderProps={{ color: "pcsPurple", type: "bars" }}
        />
        <TrackingForm
          orderNo={params.id}
          status={data?.getOrderByOrderNumber?.status}
          shipping={data?.getOrderByOrderNumber?.shipping}
        />
      </Box>
    </Modal>
  );
}
