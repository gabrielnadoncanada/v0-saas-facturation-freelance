"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export function useCategories(userId: string) {
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    if (!userId) return

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("product_categories")
        .select("*")
        .eq("user_id", userId)
        .order("name", { ascending: true })

      if (error) {
        console.error("Error fetching categories:", error)
        setError(error.message)
      } else {
        setCategories(data || [])
      }
    } catch (err: any) {
      console.error("Unexpected error:", err)
      setError(err.message || "Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [userId])

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
  }
}
