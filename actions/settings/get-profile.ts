"use server"
import { createClient } from '@/lib/supabase/server';

export async function getUserProfileAction() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return { success: false, error: "Non authentifié", data: null };
    }
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
    if (profileError) {
        return { success: false, error: profileError.message, data: null };
    }
    return { success: true, data: profile, error: null };
} 