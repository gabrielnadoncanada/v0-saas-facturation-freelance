import { Category, CategoryFormData } from '@/features/category/shared/types/category.types';
import { getSessionUser } from '@/shared/utils/getSessionUser'
import { insertRecord } from '@/shared/services/supabase/crud'

export async function createCategory(data: CategoryFormData): Promise<Category> {
  const { supabase, user, organization } = await getSessionUser()
  
  if (!organization) {
    throw new Error("Aucune organisation active")
  }

  const finalData = {
    ...data,
    user_id: user.id,
    organization_id: organization.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return await insertRecord<Category>(
    supabase, 
    'product_categories', 
    finalData
  )
}
