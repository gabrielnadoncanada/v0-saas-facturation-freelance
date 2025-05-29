'use server'

import { deleteProduct } from '@/features/product/delete/model/deleteProduct'
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'
import { revalidatePath } from "next/cache"

export async function deleteProductAction(productId: string): Promise<Result<null>> {
  return withAction(async () => {
    await deleteProduct(productId)
    return null
  }, { revalidatePath: '/dashboard/products' })
}
