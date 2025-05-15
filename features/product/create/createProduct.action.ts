'use server'

import { createProductInDb } from './createProductInDb'
import { Product, ProductActionResult } from '@/shared/types/products/product'
import { revalidatePath } from "next/cache"

export async function createProductAction(formData: Product): Promise<ProductActionResult> {
  try {
    await createProductInDb(formData)
    revalidatePath("/dashboard/products")
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
