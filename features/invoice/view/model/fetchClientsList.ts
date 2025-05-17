import { getSessionUser } from "@/shared/utils/getSessionUser"

export async function fetchClientsList() {
    const { supabase, user } = await getSessionUser()

    const { data, error } = await supabase
      .from("clients")
      .select("id, name")
      .eq("user_id", user.id)
      .order("name", { ascending: true })
  
    if (error) throw new Error(error.message)
    return data || []
  }
  