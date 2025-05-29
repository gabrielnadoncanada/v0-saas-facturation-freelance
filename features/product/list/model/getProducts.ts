import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Product } from '@/features/product/shared/types/product.types'
import { fetchList } from '@/shared/services/supabase/crud'

export async function getProducts(): Promise<Product[]> {
  const { supabase, user } = await getSessionUser()

  return await fetchList<Product>(
    supabase,
    'products',
    '*, category:category_id(id, name, color)',
    { user_id: user.id },
    { column: 'created_at', ascending: false }
  )
}
