import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClientStatsProps } from '../types/client-view.types';
import { formatCurrency } from '@/shared/lib/utils';
import { CircleDollarSign, FileText, PercentCircle, TrendingUp } from 'lucide-react';

export function ClientStatsView({ stats, currency = 'EUR' }: ClientStatsProps) {
  if (!stats) return null;

  const statsItems = [
    {
      title: 'Total facturé',
      value: formatCurrency(stats.totalInvoiced, currency),
      description: `${stats.invoiceCount} factures`,
      icon: CircleDollarSign,
      color: 'text-blue-500',
    },
    {
      title: 'Total payé',
      value: formatCurrency(stats.totalPaid, currency),
      description: `${stats.paidInvoiceCount} factures payées`,
      icon: TrendingUp,
      color: 'text-green-500',
    },
    {
      title: 'Total non payé',
      value: formatCurrency(stats.totalUnpaid, currency),
      description: `${stats.unpaidInvoiceCount} factures en attente`,
      icon: FileText,
      color: 'text-amber-500',
    },
    {
      title: 'Taux de paiement',
      value: `${Math.round(stats.paidPercentage)}%`,
      description: `Facture moyenne: ${formatCurrency(stats.averageInvoiceAmount, currency)}`,
      icon: PercentCircle,
      color: 'text-purple-500',
    },
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl">Statistiques client</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsItems.map((item, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <div className="flex items-center gap-2">
                <item.icon className={`h-5 w-5 ${item.color}`} />
                <span className="text-sm font-medium">{item.title}</span>
              </div>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
