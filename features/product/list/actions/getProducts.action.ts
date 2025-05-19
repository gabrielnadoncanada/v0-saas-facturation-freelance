'use server'

import { getProducts } from '@/features/product/list/model/getProducts'
import { Product } from '@/features/product/shared/types/product.types'
import { fail, Result, success } from '@/shared/utils/result'

export async function getProductsAction(): Promise<Result<Product[]>> {
  try {
    const products = await getProducts()
    return success(products)
  } catch (error) {
    return fail((error as Error).message)
  }
}
