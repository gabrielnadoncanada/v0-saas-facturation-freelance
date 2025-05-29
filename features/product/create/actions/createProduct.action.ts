'use server'

import { createProduct } from '@/features/product/create/model/createProduct'
import { Product } from '@/features/product/shared/types/product.types'
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'
import { revalidatePath } from "next/cache"

export async function createProductAction(formData: Product): Promise<Result<null>> {
  return withAction(async () => {
    await createProduct(formData)
    return null
  }, { revalidatePath: '/dashboard/products' })
}
