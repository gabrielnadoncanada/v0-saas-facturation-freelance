"use server"
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from "next/cache";

export async function uploadLogoAction(formData: FormData) {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return { success: false, error: "Non authentifié", logoUrl: null };
    }
    const logoFile = formData.get("logo") as File;
    if (!logoFile || logoFile.size === 0) {
        return { success: false, error: "Aucun fichier sélectionné", logoUrl: null };
    }
    if (logoFile.size > 2 * 1024 * 1024) {
        return { success: false, error: "Le fichier est trop volumineux (max 2MB)", logoUrl: null };
    }
    if (!logoFile.type.startsWith("image/")) {
        return { success: false, error: "Le fichier doit être une image", logoUrl: null };
    }
    const fileExt = logoFile.name.split(".").pop();
    const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage.from("logos").upload(fileName, logoFile, { upsert: true });
    if (uploadError) {
        return { success: false, error: uploadError.message, logoUrl: null };
    }
    const { data: publicUrlData } = supabase.storage.from("logos").getPublicUrl(fileName);
    const { error: updateError } = await supabase
        .from("profiles")
        .update({ logo_url: publicUrlData.publicUrl })
        .eq("id", session.user.id);
    if (updateError) {
        return { success: false, error: updateError.message, logoUrl: null };
    }
    revalidatePath("/dashboard/settings");
    return { success: true, error: null, logoUrl: publicUrlData.publicUrl };
} 