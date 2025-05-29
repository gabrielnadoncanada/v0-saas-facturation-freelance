import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Product } from '@/features/product/shared/types/product.types'
import { updateRecord } from '@/shared/services/supabase/crud'

export async function updateProduct(productId: string, formData: Product): Promise<Product> {
  const { supabase, user } = await getSessionUser()

  if (!formData.name.trim()) {
    throw new Error("Le nom du produit est requis")
  }

  if (formData.price < 0) {
    throw new Error("Le prix ne peut pas être négatif")
  }

  const productData = {
    name: formData.name.trim(),
    description: formData.description?.trim() || '',
    price: formData.price,
    tax_rate: formData.tax_rate,
    is_service: formData.is_service,
    category_id: formData.category_id === "none" ? null : formData.category_id,
    updated_at: new Date().toISOString(),
  }

  return await updateRecord<Product>(
    supabase,
    'products',
    productId,
    productData,
    '*',
    { user_id: user.id }
  )
}
