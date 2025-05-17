import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Category } from '@/shared/types/categories/category'

export async function fetchCategoryById(categoryId: string): Promise<Category> {
  const { supabase, user } = await getSessionUser()

  const { data, error } = await supabase
    .from("product_categories")
    .select("*")
    .eq("id", categoryId)
    .eq("user_id", user.id)
    .single()

  if (error) throw new Error(error.message)

  return data as Category
}
