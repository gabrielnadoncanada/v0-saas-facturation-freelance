"use server"

import { deleteCategory } from '@/features/category/delete/model/deleteCategory'
import { revalidatePath } from "next/cache"
import { fail, Result, success } from '@/shared/utils/result'

export async function deleteCategoryAction(categoryId: string): Promise<Result<null>> {
  try {
    await deleteCategory(categoryId)
    revalidatePath("/dashboard/products/categories")
    revalidatePath("/dashboard/products")
    return success(null)
  } catch (error) {
    return fail((error as Error).message)
  }
}
