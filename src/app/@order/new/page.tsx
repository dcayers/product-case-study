"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import { Modal, Loader } from "@mantine/core";
import { OrderForm } from "@/components/OrderForm";
import { CREATE_DRAFT_ORDER } from "@/graphql/mutations";
import { ORDERS_QUERY } from "@/graphql/queries";

export default function NewOrder() {
  const router = useRouter();
  // const [createDraftOrder, { data, loading, error }] =
  //   useMutation(CREATE_DRAFT_ORDER);
  const { data } = useQuery(ORDERS_QUERY)

  useEffect(() => {
    console.log(window)
    
  }, []);

  return (
    <Modal
      opened={true}
      onClose={() => router.back()}
      title="Create New Order"
      size="xl"
    >
      {/* {loading && <Loader size={50} />} */}
      {<OrderForm />}
      {/* <button onClick={() => createDraftOrder()}>test</button> */}
    </Modal>
  );
}
