import { getSessionUser } from '@/shared/utils/getSessionUser'

export async function deleteProductInDb(productId: string): Promise<void> {
  const { supabase, user } = await getSessionUser()

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("user_id", user.id)

  if (error) {
    throw new Error(error.message)
  }
}
