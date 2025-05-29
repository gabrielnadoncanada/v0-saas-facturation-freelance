import { Category } from '@/features/category/shared/types/category.types'
import { getSessionUser } from '@/shared/utils/getSessionUser'
import { fetchList } from '@/shared/services/supabase/crud'

export async function getCategories(): Promise<Category[]> {
  const { supabase, user } = await getSessionUser()

  return await fetchList<Category>(
    supabase,
    'product_categories',
    '*, products:products(count)',
    { user_id: user.id },
    { column: 'name', ascending: true }
  )
}
