'use server'

import { updateProduct } from '@/features/product/edit/model/updateProduct'
import { Product } from '@/features/product/shared/types/product.types'
import { fail, Result } from '@/shared/utils/result'
import { success } from '@/shared/utils/result'
import { revalidatePath } from "next/cache"

export async function updateProductAction(
  productId: string,
  formData: Product
): Promise<Result<null>> {
  try {
    await updateProduct(productId, formData)
    revalidatePath("/dashboard/products")
    revalidatePath(`/dashboard/products/${productId}`)
    return success(null)
  } catch (error) {
    return fail((error as Error).message)
  }
}
