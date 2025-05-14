import { getSessionUser } from '@/shared/getSessionUser'
import { CategoryFormData } from '@/types/categories/category'

export async function updateCategoryInDb(categoryId: string, data: CategoryFormData) {
  const { supabase, user } = await getSessionUser()

  const finalData = {
    ...data,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from("product_categories")
    .update(finalData)
    .eq("id", categoryId)
    .eq("user_id", user.id)

  if (error) throw new Error(error.message)
}
