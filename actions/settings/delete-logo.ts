"use server"
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from "next/cache";
import { LogoActionResult } from '@/types/settings/profile';

export async function deleteLogoAction(): Promise<LogoActionResult> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return { success: false, error: "Non authentifié" };
    }
    // Récupérer l'URL du logo actuel
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("logo_url")
        .eq("id", session.user.id)
        .single();
    if (profileError) {
        return { success: false, error: profileError.message };
    }
    if (profile.logo_url) {
        const fileName = profile.logo_url.split("/").pop();
        const { error: deleteError } = await supabase.storage.from("logos").remove([fileName]);
        if (deleteError) {
            return { success: false, error: deleteError.message };
        }
    }
    const { error: updateError } = await supabase
        .from("profiles")
        .update({ logo_url: null })
        .eq("id", session.user.id);
    if (updateError) {
        return { success: false, error: updateError.message };
    }
    revalidatePath("/dashboard/settings");
    return { success: true, error: undefined };
} 