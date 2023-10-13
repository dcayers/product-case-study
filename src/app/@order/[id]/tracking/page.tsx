"use client"
import { useRouter } from 'next/navigation'
import { Modal } from '@mantine/core';
import { TrackingForm } from '@/components/TrackingForm';

export default function NewOrder() {
  const router = useRouter()
  return (
    <Modal opened={true} onClose={() => router.back()} title="Add Tracking Details" size="xl">
      <TrackingForm />
    </Modal>
  )
}