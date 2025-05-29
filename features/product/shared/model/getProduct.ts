import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Product } from '@/features/product/shared/types/product.types'
import { fetchById } from '@/shared/services/supabase/crud'

export async function getProduct(productId: string): Promise<Product> {
  const { supabase, user } = await getSessionUser()

  return await fetchById<Product>(
    supabase,
    'products',
    productId,
    '*',
    { user_id: user.id }
  )
}
