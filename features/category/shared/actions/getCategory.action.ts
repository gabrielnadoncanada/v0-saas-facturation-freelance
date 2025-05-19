'use server'

import { fail, Result, success } from '@/shared/utils/result'
import { getCategory } from '@/features/category/shared/model/getCategory'
import { Category } from '@/features/category/shared/types/category.types'

export async function getCategoryAction(categoryId: string): Promise<Result<Category>> {
  try {
    const category = await getCategory(categoryId)
    return success(category)
  } catch (error) {
    return fail((error as Error).message)
  }
} 