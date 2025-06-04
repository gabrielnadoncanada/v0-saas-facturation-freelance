import { TimeEntryForm } from '@/features/time-tracking/shared/ui/TimeEntryForm';
import { getTimeEntryAction } from '@/features/time-tracking/shared/actions/getTimeEntry.action';
import { getProjectsAction } from '@/features/project/list/actions/getProjects.action';
import { redirect } from 'next/navigation';

export default async function EditTimeEntryPage({ params }: { params: { id: string } }) {
  const entry = await getTimeEntryAction(params.id);
  const projects = await getProjectsAction();

  if (!entry.success || !projects.success) {
    redirect('/login');
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Modifier l'entrée de temps</h1>
      </div>

      <TimeEntryForm projects={projects.data} entry={entry.data} />
    </div>
  );
}
