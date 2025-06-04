import { Category } from '@/features/category/shared/types/category.types'
import { getSessionUser } from '@/shared/utils/getSessionUser'
import { fetchList } from '@/shared/services/supabase/crud'

export async function getCategories(): Promise<Category[]> {
  const { supabase, organization } = await getSessionUser()
  
  if (!organization) {
    return []
  }

  return await fetchList<Category>(
    supabase,
    'product_categories',
    '*, products:products(count)',
    { organization_id: organization.id },
    { column: 'name', ascending: true }
  )
}
