import { Category } from '@/features/category/shared/types/category.types'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'
import { getSessionUser } from '@/shared/utils/getSessionUser'

export async function deleteCategory(categoryId: string): Promise<Category> {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from("product_categories")
    .delete()
    .eq("id", categoryId)
    .eq("user_id", user.id)
    .select("*")
    .single()

  return extractDataOrThrow<Category>(res)
}
