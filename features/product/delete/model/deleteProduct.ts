import { Product } from '@/features/product/shared/types/product.types'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'
import { getSessionUser } from '@/shared/utils/getSessionUser'

export async function deleteProduct(productId: string): Promise<Product> {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("user_id", user.id)
    .select("*")
    .single()

  return extractDataOrThrow<Product>(res)
}
