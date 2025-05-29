"use server"

import { CategoryFormData } from '@/features/category/shared/types/category.types'
import { createCategory } from '@/features/category/create/model/createCategory'
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'

export async function createCategoryAction(data: CategoryFormData): Promise<Result<null>> {
  return withAction(async () => {
    await createCategory(data)
    revalidatePath("/dashboard/products/categories")
    revalidatePath("/dashboard/products")
    redirect("/dashboard/products/categories")
    return null
  })
}
