import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/shared/lib/utils';
import { Edit, Trash } from 'lucide-react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Payment } from '@/features/payment/shared/types/payment.types';
import { Button } from '@/components/ui/button';
import type React from 'react';

interface PaymentDetailsViewProps {
  payment: Payment;
  isDeleting: boolean;
  onDelete: () => void;
  getPaymentMethodLabel: (method: string) => string;
}

export function PaymentDetailsView({
  payment,
  isDeleting,
  onDelete,
  getPaymentMethodLabel,
}: PaymentDetailsViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations du paiement</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Facture</h3>
            <p className="text-lg font-medium">
              <Link href={`/dashboard/invoices/${payment.invoice_id}`} className="hover:underline">
                {payment.invoice && payment.invoice.invoice_number}
              </Link>
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
            <p className="text-lg font-medium">{payment.invoice && payment.invoice.client.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Montant</h3>
            <p className="text-lg font-medium">
              {formatCurrency(payment.amount, payment.invoice.currency)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Date de paiement</h3>
            <p className="text-lg font-medium">{formatDate(payment.payment_date as string)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Méthode de paiement</h3>
            <p className="text-lg font-medium">{getPaymentMethodLabel(payment.payment_method)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Montant total de la facture
            </h3>
            <p className="text-lg font-medium">
              {formatCurrency(payment.invoice.total, payment.invoice.currency)}
            </p>
          </div>
        </div>

        {payment.notes && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
            <p className="mt-1 whitespace-pre-line">{payment.notes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="text-red-500 hover:bg-red-50 hover:text-red-600">
              <Trash className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action ne peut pas être annulée. Cela supprimera définitivement ce paiement et
                pourrait affecter le statut de la facture associée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-red-600 hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Link href={`/dashboard/payments/${payment.id}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
