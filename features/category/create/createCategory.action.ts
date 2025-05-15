"use server"

import { CategoryFormData, CategoryActionResult } from '@/shared/types/categories/category'
import { createCategoryInDb } from './createCategoryInDb'
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createCategoryAction(data: CategoryFormData): Promise<CategoryActionResult> {
  try {
    await createCategoryInDb(data)

    revalidatePath("/dashboard/products/categories")
    revalidatePath("/dashboard/products")
    redirect("/dashboard/products/categories")
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
