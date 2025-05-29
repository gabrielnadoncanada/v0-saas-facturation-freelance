"use server"

import { deleteCategory } from '@/features/category/delete/model/deleteCategory'
import { revalidatePath } from "next/cache"
import { PRODUCT_CATEGORIES_PATH, PRODUCTS_PATH } from '@/shared/lib/routes'
import { fail, Result, success } from '@/shared/utils/result'

export async function deleteCategoryAction(categoryId: string): Promise<Result<null>> {
  try {
    await deleteCategory(categoryId)
    revalidatePath(PRODUCT_CATEGORIES_PATH)
    revalidatePath(PRODUCTS_PATH)
    return success(null)
  } catch (error) {
    return fail((error as Error).message)
  }
}
