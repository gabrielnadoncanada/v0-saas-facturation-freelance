import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Product } from "@/features/product/shared/types/product.types"
import { productFormSchema, ProductFormSchema } from "@/features/product/shared/schema/product.schema"


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