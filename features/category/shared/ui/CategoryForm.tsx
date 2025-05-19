"use client"

import type React from "react"

import { CategoryFormView } from "@/features/category/shared/ui/CategoryFormView"
import { useCategoryForm } from "@/features/category/shared/hooks/useCategoryForm"

interface CategoryFormUIProps {
  category?: any
  isModal?: boolean
  onSuccess?: (categoryId: string | null) => void
}

export function CategoryForm({
  category,
  isModal = false,
  onSuccess,
}: CategoryFormUIProps) {
  const { form, isLoading, error, success } = useCategoryForm({ category, isModal, onSuccess })

  return (
    <CategoryFormView
      form={form}
      isLoading={isLoading}
      error={error}
      success={success}
      category={category}
    />
  )
}
