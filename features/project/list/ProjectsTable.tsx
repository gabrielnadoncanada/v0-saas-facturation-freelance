"use client"

import { useProjectsTable, ProjectWithClient } from "./hooks/useProjectsTable"
import { ProjectsTableView } from "./ui/ProjectsTableView"


export function ProjectsTable({ projects = [] }: { projects: ProjectWithClient[] }) {
  const {
    searchTerm,
    setSearchTerm,
    deleteDialogOpen,
    setDeleteDialogOpen,
    projectToDelete,
    setProjectToDelete,
    isDeleting,
    deleteError,
    filteredProjects,
    handleDelete,
    router,
  } = useProjectsTable(projects)

  return (
    <ProjectsTableView
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      deleteDialogOpen={deleteDialogOpen}
      setDeleteDialogOpen={setDeleteDialogOpen}
      projectToDelete={projectToDelete}
      setProjectToDelete={setProjectToDelete}
      isDeleting={isDeleting}
      deleteError={deleteError}
      filteredProjects={filteredProjects}
      handleDelete={handleDelete}
      onView={(id) => router.push(`/dashboard/projects/${id}`)}
      onEdit={(id) => router.push(`/dashboard/projects/${id}/edit`)}
    />
  )
}
