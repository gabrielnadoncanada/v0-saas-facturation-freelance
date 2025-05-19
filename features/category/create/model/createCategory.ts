import { Category, CategoryFormData } from '@/features/category/shared/types/category.types'
import { getSessionUser } from '@/shared/utils/getSessionUser'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'

export async function createCategory(data: CategoryFormData): Promise<Category> {
  const { supabase, user } = await getSessionUser()

  const finalData = {
    ...data,
    user_id: user.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const res = await supabase
    .from("product_categories")
    .insert(finalData)
    .select("*")
    .single()

  return extractDataOrThrow<Category>(res)
}
