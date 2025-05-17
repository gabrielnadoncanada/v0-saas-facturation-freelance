'use server'

import { updateCategoryInDb } from '@/features/category/edit/model/updateCategoryInDb'
import { CategoryFormData, CategoryActionResult } from '@/shared/types/categories/category'
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function updateCategoryAction(
  categoryId: string,
  data: CategoryFormData
): Promise<CategoryActionResult> {
  try {
    await updateCategoryInDb(categoryId, data)

    revalidatePath("/dashboard/products/categories")
    revalidatePath("/dashboard/products")
    redirect("/dashboard/products/categories")
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
