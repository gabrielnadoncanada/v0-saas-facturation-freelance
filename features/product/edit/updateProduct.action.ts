'use server'

import { updateProductInDb } from './updateProductInDb'
import { Product, ProductActionResult } from '@/shared/types/products/product'
import { revalidatePath } from "next/cache"

export async function updateProductAction(
  productId: string,
  formData: Product
): Promise<ProductActionResult> {
  try {
    await updateProductInDb(productId, formData)

    revalidatePath("/dashboard/products")
    revalidatePath(`/dashboard/products/${productId}`)

    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
