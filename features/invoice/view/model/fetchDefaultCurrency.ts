import { getSessionUser } from "@/shared/utils/getSessionUser"

export async function fetchDefaultCurrency(): Promise<string> {
    const { supabase, user } = await getSessionUser()

    const { data, error } = await supabase
      .from("profiles")
      .select("default_currency")
      .eq("id", user.id)
      .single()
  
    if (error) throw new Error(error.message)
    return data?.default_currency || "EUR"
  }
  