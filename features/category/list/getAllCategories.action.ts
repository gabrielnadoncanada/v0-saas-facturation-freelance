'use server'

import { fetchAllCategories } from './fetchAllCategories'
import { Category } from '@/shared/types/categories/category'

export async function getAllCategoriesAction(): Promise<Category[]> {
  return await fetchAllCategories()
}

