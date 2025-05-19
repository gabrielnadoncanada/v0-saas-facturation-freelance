'use server'

import { deleteProduct } from '@/features/product/delete/model/deleteProduct'
import { fail, Result } from '@/shared/utils/result'
import { success } from '@/shared/utils/result'
import { revalidatePath } from "next/cache"

export async function deleteProductAction(productId: string): Promise<Result<null>> {
  try {
     await deleteProduct(productId)
    revalidatePath("/dashboard/products")
    return success(null)
  } catch (error) {
    return fail((error as Error).message)
  }
}
