import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Product } from '@/features/product/shared/types/product.types'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'

export async function getProduct(productId: string): Promise<Product> {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .eq("user_id", user.id)
    .single()

  return extractDataOrThrow<Product>(res)
}
