"use server"
import { createClient } from '@/shared/lib/supabase/server';

export async function getPendingInvoicesAction() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return { invoices: [], error: "Non authentifié" };
    }
    const { data: invoices, error } = await supabase
        .from("invoices")
        .select("id, invoice_number, client_id, total, clients(name)")
        .eq("user_id", session.user.id)
        .eq("status", "sent")
        .order("due_date", { ascending: false });
    if (error) {
        return { invoices: [], error: "Erreur lors de la récupération des factures" };
    }
    return { invoices: invoices || [], error: null };
} 