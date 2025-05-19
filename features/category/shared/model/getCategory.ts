import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Category } from '@/features/category/shared/types/category.types'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'

export async function getCategory(categoryId: string): Promise<Category> {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from("product_categories")
    .select("*")
    .eq("id", categoryId)
    .eq("user_id", user.id)
    .single()

  return extractDataOrThrow<Category>(res)
}
