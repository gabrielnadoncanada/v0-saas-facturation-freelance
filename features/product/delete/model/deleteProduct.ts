import { Product } from '@/features/product/shared/types/product.types'
import { getSessionUser } from '@/shared/utils/getSessionUser'
import { deleteRecord } from '@/shared/services/supabase/crud'

export async function deleteProduct(productId: string): Promise<Product> {
  const { supabase, user } = await getSessionUser()

  return await deleteRecord<Product>(
    supabase,
    'products',
    productId,
    '*',
    { user_id: user.id }
  )
}
