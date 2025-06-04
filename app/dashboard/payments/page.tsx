import { PaymentsTable } from '@/features/payment/list/ui/PaymentsTable';
import { Button } from '@/components/ui/button';
import { getPaymentsAction } from '@/features/payment/list/actions/getPayments.action';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function PaymentsPage() {
  const result = await getPaymentsAction();

  if (!result.success) {
    redirect('/login');
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paiements</h1>
          <p className="text-muted-foreground">Gérez les paiements reçus pour vos factures</p>
        </div>
        <Link href="/dashboard/payments/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau paiement
          </Button>
        </Link>
      </div>

      <PaymentsTable payments={result.data!} />
    </div>
  );
}
