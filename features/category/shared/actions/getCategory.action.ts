'use server'

import { fetchCategoryById } from '../model/fetchCategoryById'
import { CategoryActionResult } from '@/shared/types/categories/category'

export async function getCategoryAction(categoryId: string): Promise<CategoryActionResult> {
  try {
    const category = await fetchCategoryById(categoryId)
    return { success: true, data: category }
  } catch (error) {
    return { success: false, error: (error as Error).message, data: null }
  }
} 