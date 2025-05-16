"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientAction } from "@/features/client/create/createClient.action"
import { ClientFormSchema } from "@/shared/types/clients/client"
import { ClientForm } from "@/features/client/shared/ClientForm"

export function CreateClientForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const defaultValues: ClientFormSchema = {
    name: "gay",
    email: "",
    phone: "",
    hourly_rate: "",
    billing_address: "",
    billing_city: "",
    billing_postal_code: "",
    billing_country: "",
    shipping_address: "",
    shipping_city: "",
    shipping_postal_code: "",
    shipping_country: "",
    notes: "",
    sameAsShipping: true,
  }

  async function onSubmit(data: ClientFormSchema) {
    setIsLoading(true)
    setError(null)
    let submitData = { ...data }
    if (data.sameAsShipping) {
      submitData.shipping_address = data.billing_address
      submitData.shipping_city = data.billing_city
      submitData.shipping_postal_code = data.billing_postal_code
      submitData.shipping_country = data.billing_country
    }
    try {
      const result = await createClientAction(submitData)
      if (!result.success) {
        setError(result.error || "Une erreur est survenue")
      }
    } catch (err) {
      setError("Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

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