import { Category } from '@/shared/types/categories/category'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'
import { getSessionUser } from '@/shared/utils/getSessionUser'

export async function fetchAllCategories(): Promise<Category[]> {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from("product_categories")
    .select("*, products:products(count)")
    .eq("user_id", user.id)
    .order("name", { ascending: true })


  return extractDataOrThrow<Category[]>(res)
}
