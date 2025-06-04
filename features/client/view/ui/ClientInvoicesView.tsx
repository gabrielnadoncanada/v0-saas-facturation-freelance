import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClientInvoicesProps } from '../types/client-view.types';
import { formatCurrency, formatDate } from '@/shared/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Invoice } from '@/features/invoice/shared/types/invoice.types';

export function ClientInvoicesView({ invoices, currency = 'EUR' }: ClientInvoicesProps) {
  // Fonction pour déterminer la couleur du badge en fonction du statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Payée</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">En attente</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500">En retard</Badge>;
      case 'draft':
        return <Badge className="bg-slate-500">Brouillon</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Factures</CardTitle>
        <Link href={`/dashboard/invoices/new`} passHref>
          <Button variant="outline" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle facture
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <FileText className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Aucune facture</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Ce client n'a pas encore de factures. Créez-en une nouvelle pour commencer.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <Link href={`/dashboard/invoices/${invoice.id}`} key={invoice.id} className="block">
                <div className="flex flex-col space-y-2 rounded-lg border p-4 transition-colors hover:bg-accent/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{invoice.invoice_number}</span>
                    </div>
                    {getStatusBadge(invoice.status)}
                  </div>
                  <div className="flex flex-col space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date d'émission</span>
                      <span>{formatDate(String(invoice.issue_date))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date d'échéance</span>
                      <span>{formatDate(String(invoice.due_date))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Montant</span>
                      <span className="font-bold">{formatCurrency(invoice.total, currency)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
