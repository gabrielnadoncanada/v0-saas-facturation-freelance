import { getProjectAction } from '@/features/project/view/actions/getProject.action';
import { Project } from '@/features/project/view/Project';
import { notFound, redirect } from 'next/navigation';

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const result = await getProjectAction(params.id);

  if (!result.success) {
    if (result.error === 'Non authentifié') {
      redirect('/login');
    }
    notFound();
  }

  return <Project project={result.data} />;
}
