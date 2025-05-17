'use server'

import { fetchAllCategories } from '@/features/category/list/model/fetchAllCategories'
import { Category } from '@/shared/types/categories/category'

export async function getAllCategoriesAction(): Promise<Category[]> {
  return await fetchAllCategories()
}

