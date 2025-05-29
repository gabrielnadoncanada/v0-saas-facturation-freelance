import { Category, CategoryFormData } from '@/features/category/shared/types/category.types'
import { getSessionUser } from '@/shared/utils/getSessionUser'
import { insertRecord } from '@/shared/services/supabase/crud'

export async function createCategory(data: CategoryFormData): Promise<Category> {
  const { supabase, user } = await getSessionUser()

  const finalData = {
    ...data,
    user_id: user.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return await insertRecord<Category>(
    supabase,
    'product_categories',
    finalData
  )
}
