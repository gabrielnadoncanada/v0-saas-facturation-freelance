import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Category, CategoryFormData } from '@/features/category/shared/types/category.types'
import { updateRecord } from '@/shared/services/supabase/crud'

export async function updateCategory(categoryId: string, data: CategoryFormData): Promise<Category> {
  const { supabase, organization } = await getSessionUser()
  
  if (!organization) {
    throw new Error("Aucune organisation active")
  }

  const finalData = {
    ...data,
    updated_at: new Date().toISOString(),
  }

  return await updateRecord<Category>(
    supabase,
    'product_categories',
    categoryId,
    finalData,
    '*',
    { organization_id: organization.id }
  )
}
