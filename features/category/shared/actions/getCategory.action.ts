'use server'

import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'
import { getCategory } from '@/features/category/shared/model/getCategory'
import { Category } from '@/features/category/shared/types/category.types'

export async function getCategoryAction(categoryId: string): Promise<Result<Category>> {
  return withAction(async () => {
    const category = await getCategory(categoryId)
    return category
  })
}
