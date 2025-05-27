"use client"

import { useRouter } from "next/navigation"
import { Client } from "@/features/client/shared/types/client.types"
import { ClientFormView } from "./ClientFormView"
import { useClientForm } from "@/features/client/shared/hooks/useClientForm"
import { createClientAction } from "@/features/client/create/actions/createClient.action"
import { updateClientAction } from "@/features/client/edit/actions/updateClient.action"

export function ClientForm({ client }: { client: Client | null }) {
  const router = useRouter()

  const {
    form,
    isLoading,
    error,
    onSubmit,
  } = useClientForm({
    client,
    createClientAction,
    updateClientAction,
    onSubmitSuccess: () => {
      router.push("/dashboard/clients")
      router.refresh()
    },
  })

  return (
    <ClientFormView
      form={form}
      error={error}
      isLoading={isLoading}
      onSubmit={onSubmit}
      isEdit={!!client}
    />
  )
} 