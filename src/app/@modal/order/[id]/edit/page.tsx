"use client";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { Modal, Loader, Center, Skeleton } from "@mantine/core";
import { OrderForm } from "@/components/OrderForm";
import { ORDERS_BY_ORDER_NO_QUERY } from "@/graphql/queries";

export default function NewOrder({ params }: { params: { id: string } }) {
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
      onClose={() => {
        router.back();
      }}
      title={
        <Skeleton visible={loading}>
          Edit Order {data && data.getOrderByOrderNumber.orderNo}
        </Skeleton>
      }
      size="xl"
    >
      {loading && (
        <Center>
          <Loader size={50} />
        </Center>
      )}
      {data && <OrderForm order={data?.getOrderByOrderNumber} />}
    </Modal>
  );
}
