import { useState } from "react"
import { updateClientAction } from "@/features/client/edit/actions/updateClient.action"
import { Client, ClientFormData } from "@/features/client/shared/types/client.types"
import { ClientFormSchema } from "@/features/client/shared/schema/client.schema"

export function useEditClientForm(client: Client) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const defaultValues: ClientFormSchema = {
    name: client?.name || "",
    email: client?.email || "",
    phone: client?.phone || "",
    hourly_rate: client?.hourly_rate?.toString() || "",
    billing_address: client?.billing_address || "",
    billing_city: client?.billing_city || "",
    billing_postal_code: client?.billing_postal_code || "",
    billing_country: client?.billing_country || "",
    shipping_address: client?.shipping_address || "",
    shipping_city: client?.shipping_city || "",
    shipping_postal_code: client?.shipping_postal_code || "",
    shipping_country: client?.shipping_country || "",
    notes: client?.notes || "",
    sameAsShipping:
      client.shipping_address === client.billing_address &&
      client.shipping_city === client.billing_city &&
      client.shipping_postal_code === client.billing_postal_code &&
      client.shipping_country === client.billing_country,
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
      const result = await updateClientAction(client.id, submitData)
      if (!result.success) {
        setError(result.error || "Une erreur est survenue")
      }
    } catch (err) {
      setError("Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    defaultValues,
    onSubmit,
  }
} 