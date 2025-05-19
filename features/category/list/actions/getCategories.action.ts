'use server'

import { getCategories } from '@/features/category/list/model/getCategories'
import { Category } from '@/features/category/shared/types/category.types'
import { fail, Result, success } from '@/shared/utils/result'

export async function getCategoriesAction(): Promise<Result<Category[]>> {
  try {
    const categories = await getCategories()
    return success(categories)
  } catch (error) {
    return fail((error as Error).message)
  }
}

