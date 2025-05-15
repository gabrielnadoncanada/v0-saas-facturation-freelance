'use server'

import { deleteProductInDb } from './deleteProductInDb'
import { ProductActionResult } from '@/shared/types/products/product'
import { revalidatePath } from "next/cache"

export async function deleteProductAction(productId: string): Promise<ProductActionResult> {
  try {
    await deleteProductInDb(productId)
    revalidatePath("/dashboard/products")
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
