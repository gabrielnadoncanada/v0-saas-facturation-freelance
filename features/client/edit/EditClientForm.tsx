"use client"

import { useRouter } from "next/navigation"
import { ClientForm } from "@/features/client/shared/ui/ClientForm"
import { useEditClientForm } from "./hooks/useEditClientForm"
import { Client } from "@/shared/types/clients/client"

export function EditClientForm({ client }: { client: Client }) {
  const router = useRouter()
  const {
    isLoading,
    error,
    defaultValues,
    onSubmit,
  } = useEditClientForm(client)

  return (
    <ClientForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      isLoading={isLoading}
      error={error}
      onCancel={() => router.push("/dashboard/clients")}
      submitLabel="Mettre à jour"
    />
  )
} 