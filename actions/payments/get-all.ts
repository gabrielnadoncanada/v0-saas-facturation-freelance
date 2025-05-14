"use server"
import { createClient } from '@/lib/supabase/server';
import { Payment, PaymentActionResult } from '@/types/payments/payment';

export async function getAllPaymentsAction(): Promise<PaymentActionResult> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return { success: false, error: "Non authentifié", data: { payments: [] } };
    }
    const { data: payments, error } = await supabase
        .from("payments")
        .select("*, invoices(invoice_number, client_id, clients(name))")
        .eq("invoices.user_id", session.user.id)
        .order("payment_date", { ascending: false });
    if (error) {
        return { success: false, error: "Erreur lors de la récupération des paiements", data: { payments: [] } };
    }
    return { success: true, error: undefined, data: { payments: payments || [] } };
} 