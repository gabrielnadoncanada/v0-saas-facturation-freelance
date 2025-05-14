import { Category } from '@/types/categories/category'
import { getSessionUser } from '@/shared/getSessionUser'

export async function fetchAllCategories(): Promise<Category[]> {
  const { supabase, user } = await getSessionUser()

  const { data, error } = await supabase
    .from("product_categories")
    .select("*, products:products(count)")
    .eq("user_id", user.id)
    .order("name", { ascending: true })

  if (error) throw new Error(error.message)

  return data as Category[]
}
