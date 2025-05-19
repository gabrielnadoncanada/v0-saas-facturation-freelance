import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'
import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Product } from '@/features/product/shared/types/product.types'

export async function getProducts(): Promise<Product[]> {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from("products")
    .select("*, category:category_id(id, name, color)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

    return extractDataOrThrow<Product[]>(res)
}
