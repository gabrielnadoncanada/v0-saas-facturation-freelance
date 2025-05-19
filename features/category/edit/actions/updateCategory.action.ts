'use server'

import { updateCategory } from '@/features/category/edit/model/updateCategory'
import { CategoryFormData } from '@/features/category/shared/types/category.types'
import { fail, Result } from '@/shared/utils/result'
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function updateCategoryAction(
  categoryId: string,
  data: CategoryFormData
): Promise<Result<null>> {
  try {
    await updateCategory(categoryId, data)
    revalidatePath("/dashboard/products/categories")
    revalidatePath("/dashboard/products")
    redirect("/dashboard/products/categories")
  } catch (error) {
    return fail((error as Error).message)
  }
}
