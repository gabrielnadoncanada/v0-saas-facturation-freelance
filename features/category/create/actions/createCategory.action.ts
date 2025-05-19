"use server"

import { CategoryFormData } from '@/features/category/shared/types/category.types'
import { createCategory } from '@/features/category/create/model/createCategory'
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { fail, Result } from '@/shared/utils/result'

export async function createCategoryAction(data: CategoryFormData): Promise<Result<null>> {
  try {
    await createCategory(data)
    revalidatePath("/dashboard/products/categories")
    revalidatePath("/dashboard/products")
    redirect("/dashboard/products/categories")
  } catch (error) {
    return fail((error as Error).message)
  }
}
