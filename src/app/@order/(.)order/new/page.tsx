"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { Modal, Loader, Center } from "@mantine/core";
import { OrderForm } from "@/components/OrderForm";
import { CREATE_DRAFT_ORDER } from "@/graphql/mutations";

export default function NewOrder() {
  const router = useRouter();
  const [createDraftOrder, { data, loading, error }] =
    useMutation(CREATE_DRAFT_ORDER);

  useEffect(() => {
    console.log(window);
    createDraftOrder();
  }, []);

  return (
    <Modal
      opened={true}
      onClose={() => router.back()}
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
