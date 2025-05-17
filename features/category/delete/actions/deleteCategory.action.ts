"use server"

import { deleteCategoryInDb } from '../model/deleteCategoryById'
import { revalidatePath } from "next/cache"
import { CategoryActionResult } from '@/shared/types/categories/category'

export async function deleteCategoryAction(categoryId: string): Promise<CategoryActionResult> {
  try {
    await deleteCategoryInDb(categoryId)

    revalidatePath("/dashboard/products/categories")
    revalidatePath("/dashboard/products")

    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
