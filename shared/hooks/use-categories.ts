"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/shared/lib/supabase/client"

export function useCategories() {
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)



  return {
    categories,
    isLoading,
    error,
  }
}
