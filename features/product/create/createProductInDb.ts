import { getSessionUser } from '@/shared/getSessionUser'
import { Product } from '@/types/products/product'

export async function createProductInDb(formData: Product): Promise<void> {
  const { supabase, user } = await getSessionUser()

  if (!formData.name.trim()) {
    throw new Error("Le nom du produit est requis")
  }

  if (formData.price < 0) {
    throw new Error("Le prix ne peut pas être négatif")
  }

  const productData = {
    user_id: user.id,
    name: formData.name.trim(),
    description: formData.description?.trim() || '',
    price: formData.price,
    tax_rate: formData.tax_rate,
    is_service: formData.is_service,
    category_id: formData.category_id === "none" ? null : formData.category_id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("products").insert(productData)

  if (error) throw new Error(error.message)
}
