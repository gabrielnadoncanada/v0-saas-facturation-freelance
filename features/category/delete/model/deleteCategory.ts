import { Category } from '@/features/category/shared/types/category.types'
import { getSessionUser } from '@/shared/utils/getSessionUser'
import { deleteRecord } from '@/shared/services/supabase/crud'

export async function deleteCategory(categoryId: string): Promise<Category> {
  const { supabase, organization } = await getSessionUser()
  
  if (!organization) {
    throw new Error("Aucune organisation active")
  }

  return await deleteRecord<Category>(
    supabase,
    'product_categories',
    categoryId,
    '*',
    { organization_id: organization.id }
  )
}
