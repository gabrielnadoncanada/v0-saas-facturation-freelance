import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Product } from '@/shared/types/products/product'

export async function fetchProductById(productId: string): Promise<Product> {
  const { supabase, user } = await getSessionUser()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .eq("user_id", user.id)
    .single()

  if (error) throw new Error(error.message)

  return data as Product
}
