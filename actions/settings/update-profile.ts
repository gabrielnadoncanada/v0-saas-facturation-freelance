"use server"
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from "next/cache";

export async function updateUserProfileAction(formData: FormData) {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return { success: false, error: "Non authentifié" };
    }
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const company_name = formData.get("company_name") as string;
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    const default_currency = formData.get("default_currency") as string;
    const tax_rate = Number.parseFloat(formData.get("tax_rate") as string) || 0;
    const tax_id = formData.get("tax_id") as string;
    const website = formData.get("website") as string;
    const { error: updateError } = await supabase
        .from("profiles")
        .update({
            name,
            company_name,
            address,
            phone,
            default_currency,
            tax_rate,
            tax_id,
            website,
        })
        .eq("id", session.user.id);
    if (updateError) {
        return { success: false, error: updateError.message };
    }
    if (email !== session.user.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email });
        if (emailError) {
            return { success: false, error: emailError.message };
        }
    }
    revalidatePath("/dashboard/settings");
    return { success: true, error: null };
} 