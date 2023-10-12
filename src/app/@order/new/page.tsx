"use client"
import { useRouter } from 'next/navigation'
import { Modal } from '@mantine/core';
import { OrderForm } from '@/components/OrderForm';

export default function NewOrder() {
  const router = useRouter()
  return (
    <Modal opened={true} onClose={() => router.back()} title="Create New Order" size="xl">
      <OrderForm />
    </Modal>
  )
}