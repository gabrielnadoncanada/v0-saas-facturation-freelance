'use server'

import { updateProduct } from '@/features/product/edit/model/updateProduct'
import { Product } from '@/features/product/shared/types/product.types'
import { PRODUCTS_PATH } from '@/shared/lib/routes'
import { productPath } from '@/shared/lib/routes'
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'
import { revalidatePath } from "next/cache"

export async function updateProductAction(
  productId: string,
  formData: Product
): Promise<Result<null>> {
  return withAction(async () => {
    await updateProduct(productId, formData)
    revalidatePath(PRODUCTS_PATH)
    revalidatePath(productPath(productId))
    return null
  })
}
