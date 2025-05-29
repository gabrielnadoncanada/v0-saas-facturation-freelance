'use server'

import { deleteProduct } from '@/features/product/delete/model/deleteProduct'
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'
import { revalidatePath } from "next/cache"
import { PRODUCTS_PATH } from '@/shared/lib/routes'     

export async function deleteProductAction(productId: string): Promise<Result<null>> {
  return withAction(async () => {
    await deleteProduct(productId)
    revalidatePath(PRODUCTS_PATH)
    return null
  })
}
