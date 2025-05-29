'use server'

import { createProduct } from '@/features/product/create/model/createProduct'
import { Product } from '@/features/product/shared/types/product.types'
import { fail, Result } from '@/shared/utils/result'
import { success } from '@/shared/utils/result'
import { revalidatePath } from "next/cache"
import { PRODUCTS_PATH } from '@/shared/lib/routes'

export async function createProductAction(formData: Product): Promise<Result<null>> {
  try {
    await createProduct(formData)
    revalidatePath(PRODUCTS_PATH)
    return success(null)
  } catch (error) {
    return fail((error as Error).message)
  }
}
