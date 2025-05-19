import { createClient } from "@/shared/lib/supabase/server"

export async function countProjects() {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
  if (error) throw error
  return count ?? 0
} 