"use server"

import { deleteCategory } from '@/features/category/delete/model/deleteCategory'
import { revalidatePath } from "next/cache"
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'
import { PRODUCT_CATEGORIES_PATH, PRODUCTS_PATH } from '@/shared/lib/routes'
export async function deleteCategoryAction(categoryId: string): Promise<Result<null>> {
  return withAction(async () => {
    await deleteCategory(categoryId)
    revalidatePath(PRODUCT_CATEGORIES_PATH)
    revalidatePath(PRODUCTS_PATH)
    return null
  })
}
