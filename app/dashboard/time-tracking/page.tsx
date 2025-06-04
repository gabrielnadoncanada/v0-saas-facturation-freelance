import { TimeEntriesTable } from '@/features/time-tracking/list/ui/TimeEntriesTable';
import { Button } from '@/components/ui/button';
import { getTimeEntriesAction } from '@/features/time-tracking/list/actions/getTimeEntries.action';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function TimeTrackingPage() {
  const result = await getTimeEntriesAction();

  if (!result.success) {
    redirect('/login');
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suivi du temps</h1>
          <p className="text-muted-foreground">Consultez et gérez vos entrées de temps</p>
        </div>
        <Link href="/dashboard/time-tracking/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle entrée
          </Button>
        </Link>
      </div>

      <TimeEntriesTable entries={result.data} />
    </div>
  );
}
