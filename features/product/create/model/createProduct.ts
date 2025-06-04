import { Product } from '@/features/product/shared/types/product.types'
import { getSessionUser } from '@/shared/utils/getSessionUser'
import { insertRecord } from '@/shared/services/supabase/crud'

export async function createProduct(formData: any): Promise<Product> {
  const { supabase, user, organization } = await getSessionUser()
  
  if (!organization) {
    throw new Error("Aucune organisation active")
  }

  if (!formData.name.trim()) {
    throw new Error('Le nom du produit est requis')
  }

  const productData = {
    user_id: user.id,
    organization_id: organization.id,
    name: formData.name.trim(),
    description: formData.description?.trim() || '',
    price: Number(formData.price) || 0,
    tax_rate: Number(formData.tax_rate) || 0,
    is_service: Boolean(formData.is_service),
    category_id: formData.category_id || null,
  }

  return await insertRecord<Product>(
    supabase,
    'products',
    productData
  )
}
