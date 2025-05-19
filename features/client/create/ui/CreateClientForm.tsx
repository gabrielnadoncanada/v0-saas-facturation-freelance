"use client"

import { useRouter } from "next/navigation"
import { ClientForm } from "@/features/client/shared/ui/ClientForm"
import { useCreateClientForm } from "@/features/client/create/hooks/useCreateClientForm"

export function CreateClientForm() {
  const router = useRouter()
  const {
    isLoading,
    error,
    defaultValues,
    onSubmit,
  } = useCreateClientForm()

  return (
    <ClientForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      isLoading={isLoading}
      error={error}
      onCancel={() => router.push("/dashboard/clients")}
      submitLabel="Créer le client"
    />
  )
} 