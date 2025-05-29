import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Project } from '@/features/project/shared/types/project.types'

export function useProjectView(project: Project) {
  const router = useRouter()

  const handleRefresh = useCallback(() => {
    router.refresh()
  }, [router])

  const navigateToEdit = useCallback(() => {
    router.push(`/dashboard/projects/${project.id}/edit`)
  }, [router, project.id])

  return {
    handleRefresh,
    navigateToEdit,
  }
} 