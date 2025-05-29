"use server"

import { CategoryFormData } from '@/features/category/shared/types/category.types'
import { createCategory } from '@/features/category/create/model/createCategory'
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { PRODUCT_CATEGORIES_PATH, PRODUCTS_PATH } from '@/shared/lib/routes'
import { fail, Result } from '@/shared/utils/result'

export async function createCategoryAction(data: CategoryFormData): Promise<Result<null>> {
  try {
    await createCategory(data)
    revalidatePath(PRODUCT_CATEGORIES_PATH)
    revalidatePath(PRODUCTS_PATH)
    redirect(PRODUCT_CATEGORIES_PATH)
  } catch (error) {
    return fail((error as Error).message)
  }
}
