import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Product } from "@/shared/types/products/product"

// Zod schema for product form
export const productFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string(),
  price: z
    .number({ invalid_type_error: "Le prix doit être un nombre" })
    .min(0, "Le prix doit être positif"),
  tax_rate: z
    .number({ invalid_type_error: "Le taux de TVA doit être un nombre" })
    .min(0, "Le taux de TVA doit être positif"),
  is_service: z.boolean(),
  category_id: z.string().nullable(),
})

export type ProductFormSchema = z.infer<typeof productFormSchema>

interface UseProductFormOptions {
  product: Product | null
  onSubmitSuccess?: () => void
  createProductAction: (data: Product) => Promise<any>
  updateProductAction: (id: string, data: Product) => Promise<any>
}

export function useProductForm({
  product,
  onSubmitSuccess,
  createProductAction,
  updateProductAction,
}: UseProductFormOptions) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ProductFormSchema>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price ?? 0,
      tax_rate: product?.tax_rate ?? 20,
      is_service: product?.is_service ?? false,
      category_id: product?.category_id || null,
    },
    mode: "onBlur",
  })

  const onSubmit = async (values: ProductFormSchema) => {
    setIsLoading(true)
    setError(null)
    try {
      const payload: Product = {
        ...values,
        description: values.description ?? "",
      }
      const result = product
        ? await updateProductAction(product.id!, payload)
        : await createProductAction(payload)
      if (result.error) {
        setError(result.error)
        setIsLoading(false)
        return
      }
      if (onSubmitSuccess) onSubmitSuccess()
    } catch (err: any) {
      setError(err.message || "Une erreur inattendue est survenue")
      setIsLoading(false)
    }
  }

  return {
    form,
    isLoading,
    setIsLoading,
    error,
    setError,
    onSubmit,
  }
} 