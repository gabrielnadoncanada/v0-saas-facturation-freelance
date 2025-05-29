'use server'

import { updateCategory } from '@/features/category/edit/model/updateCategory'
import { CategoryFormData } from '@/features/category/shared/types/category.types'
import { PRODUCTS_PATH, PRODUCT_CATEGORIES_PATH } from '@/shared/lib/routes'
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function updateCategoryAction(
  categoryId: string,
  data: CategoryFormData
): Promise<Result<null>> {
  return withAction(async () => {
    await updateCategory(categoryId, data)
    revalidatePath(PRODUCT_CATEGORIES_PATH)
    revalidatePath(PRODUCTS_PATH)
    redirect(PRODUCT_CATEGORIES_PATH)
    return null
  })
}
