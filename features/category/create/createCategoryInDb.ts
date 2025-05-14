import { CategoryFormData } from '@/types/categories/category'
import { getSessionUser } from '@/shared/getSessionUser'

export async function createCategoryInDb(data: CategoryFormData) {
  const { supabase, user } = await getSessionUser()

  const finalData = {
    ...data,
    user_id: user.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("product_categories").insert(finalData)
  if (error) {
    throw new Error(error.message)
  }
}
