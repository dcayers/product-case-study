"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { Modal, Loader, Center } from "@mantine/core";
import { OrderForm } from "@/components/OrderForm";
import { CREATE_DRAFT_ORDER_MUTATION } from "@/graphql/mutations";

export default function NewOrder() {
  const router = useRouter();
  const [createDraftOrder, { data, loading, error }] = useMutation(
    CREATE_DRAFT_ORDER_MUTATION
  );

  useEffect(() => {
    // TODO: Prevent duplicate entry in local due to strict mode
    createDraftOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      opened={true}
      onClose={() => {
        router.back();
      }}
      title="Create New Order"
      size="xl"
    >
      {loading && (
        <Center>
          <Loader size={50} />
        </Center>
      )}
      {data && <OrderForm order={data?.createDraftOrder} />}
    </Modal>
  );
}
