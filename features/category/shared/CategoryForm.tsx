"use client"

import type React from "react"

import { CategoryFormUI } from "./ui/CategoryFormUI"
import { useCategoryForm } from "./hooks/useCategoryForm"

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
    <CategoryFormUI
      form={form}
      isLoading={isLoading}
      error={error}
      success={success}
      category={category}
    />
  )
}
