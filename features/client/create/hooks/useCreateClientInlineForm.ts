import { useState } from "react"
import { createClientInlineAction } from "@/features/client/create/actions/createClientInline.action"
import { Client, ClientFormData } from "@/features/client/shared/types/client.types"
import { ClientFormSchema } from "@/features/client/shared/schema/client.schema"

export function useCreateClientInlineForm(onCreated: (client: Client) => void) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const defaultValues: ClientFormSchema = {
    name: "",
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
    let submitData: ClientFormData = { ...data }
    if (data.sameAsShipping) {
      submitData.shipping_address = data.billing_address
      submitData.shipping_city = data.billing_city
      submitData.shipping_postal_code = data.billing_postal_code
      submitData.shipping_country = data.billing_country
    }
    try {
      const result = await createClientInlineAction(submitData)
      if (result.success) {
        onCreated(result.data)
      } else {
        setError(result.error || "Une erreur est survenue")
      }
    } catch (err) {
      setError("Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, error, defaultValues, onSubmit }
}
