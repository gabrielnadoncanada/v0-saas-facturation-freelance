import { getSessionUser } from '@/shared/getSessionUser'

export async function deleteCategoryInDb(categoryId: string) {
  const { supabase, user } = await getSessionUser()

  const { error } = await supabase
    .from("product_categories")
    .delete()
    .eq("id", categoryId)
    .eq("user_id", user.id)

  if (error) throw new Error(error.message)
}
