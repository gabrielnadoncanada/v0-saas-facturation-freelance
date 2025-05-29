'use server'

import { updateCategory } from '@/features/category/edit/model/updateCategory'
import { CategoryFormData } from '@/features/category/shared/types/category.types'
import { fail, Result } from '@/shared/utils/result'
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { PRODUCT_CATEGORIES_PATH, PRODUCTS_PATH } from '@/shared/lib/routes'

export async function updateCategoryAction(
  categoryId: string,
  data: CategoryFormData
): Promise<Result<null>> {
  try {
    await updateCategory(categoryId, data)
    revalidatePath(PRODUCT_CATEGORIES_PATH)
    revalidatePath(PRODUCTS_PATH)
    redirect(PRODUCT_CATEGORIES_PATH)
  } catch (error) {
    return fail((error as Error).message)
  }
}
