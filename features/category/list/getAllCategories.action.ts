'use server'

import { fetchAllCategories } from './fetchAllCategories'
import { CategoryActionResult } from '@/types/categories/category'

export async function getAllCategoriesAction(): Promise<CategoryActionResult> {
  try {
    const categories = await fetchAllCategories()
    return { success: true, data: categories }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
