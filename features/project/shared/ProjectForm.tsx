"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Project } from "@/shared/types/projects/project"
import { Client } from "@/shared/types/clients/client"
import { useProjectForm } from "./hooks/useProjectForm"
import { ProjectFormView } from "./ui/ProjectFormView"

export function ProjectForm({ clients, project }: { clients: Client[], project: Project | null }) {
  const router = useRouter()

  const {
    form,
    onSubmit,
    isLoading,
    error,
  } = useProjectForm({
    project,
    router,
  })

  return (
    <ProjectFormView
      form={form}
      onSubmit={onSubmit}
      isLoading={isLoading}
      error={error}
      clients={clients}
      project={project}
    />
  )
}
