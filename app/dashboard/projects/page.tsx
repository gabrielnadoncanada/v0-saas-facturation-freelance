import { ProjectsTable } from '@/features/project/list/ui/ProjectsTable';
import { Button } from '@/components/ui/button';
import { getProjectsAction } from '@/features/project/list/actions/getProjects.action';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function ProjectsPage() {
  const result = await getProjectsAction();

  if (!result.success) {
    return <div>Error: {result.error}</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projets</h1>
          <p className="text-muted-foreground">Gérez vos projets et suivez leur avancement</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau projet
          </Button>
        </Link>
      </div>

      <ProjectsTable projects={result.data} />
    </div>
  );
}
