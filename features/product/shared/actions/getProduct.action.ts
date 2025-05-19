'use server'

import { getProduct } from "@/features/product/shared/model/getProduct"
import { Product } from '@/features/product/shared/types/product.types'
import { fail, Result } from "@/shared/utils/result"
import { success } from "@/shared/utils/result"

export async function getProductAction(productId: string): Promise<Result<Product>> {
  try {
    const product = await getProduct(productId)
    return success(product)
  } catch (error) {
    return fail((error as Error).message)
  }
}
