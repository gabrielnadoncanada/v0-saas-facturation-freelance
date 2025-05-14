import { extractDataOrThrow } from '@/shared/extractDataOrThrow'
import { getSessionUser } from '@/shared/getSessionUser'
import { Product } from '@/types/products/product'

export async function fetchAllProducts(): Promise<Product[]> {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from("products")
    .select("*, category:category_id(id, name, color)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

    return extractDataOrThrow<Product[]>(res)
}
