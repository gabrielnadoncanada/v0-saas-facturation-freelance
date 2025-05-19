import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Category, CategoryFormData } from '@/features/category/shared/types/category.types'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'

export async function updateCategory(categoryId: string, data: CategoryFormData): Promise<Category> {
  const { supabase, user } = await getSessionUser()

  const finalData = {
    ...data,
    updated_at: new Date().toISOString(),
  }

  const res = await supabase
    .from("product_categories")
    .update(finalData)
    .eq("id", categoryId)
    .eq("user_id", user.id)
    .select("*")
    .single()

  return extractDataOrThrow<Category>(res)
}
