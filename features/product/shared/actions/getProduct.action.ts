'use server'

import { fetchProductById } from "@/features/product/shared/model/fetchProductById"
import { ProductActionResult } from '@/shared/types/products/product'

export async function getProductAction(productId: string): Promise<ProductActionResult> {
  try {
    const product = await fetchProductById(productId)
    return { success: true, data: product }
  } catch (error) {
    return { success: false, error: (error as Error).message, data: null }
  }
}
