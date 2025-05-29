import { Category } from '@/features/category/shared/types/category.types'
import { getSessionUser } from '@/shared/utils/getSessionUser'
import { deleteRecord } from '@/shared/services/supabase/crud'

export async function deleteCategory(categoryId: string): Promise<Category> {
  const { supabase, user } = await getSessionUser()

  return await deleteRecord<Category>(
    supabase,
    'product_categories',
    categoryId,
    '*',
    { user_id: user.id }
  )
}
