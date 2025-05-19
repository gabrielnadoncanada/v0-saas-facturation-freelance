import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { projectFormSchema, ProjectFormSchema } from "@/features/project/shared/schema/project.schema"
// import { createProjectAction } from "@/features/project/create/createProject.action" // Décommente si le fichier existe
import { updateProjectAction } from "@/features/project/edit/actions/updateProject.action"
import { Project } from "@/features/project/shared/types/project.types"

export function useProjectForm({
  project,
  router,
  onSuccess,
}: {
  project?: Project | null
  router?: any
  onSuccess?: () => void
}) {
  const defaultValues: Partial<ProjectFormSchema> = {
    name: project?.name || "",
    client_id: project?.client?.id || "",
    description: project?.description || "",
    status: (project?.status || "active") as ProjectFormSchema["status"],
    start_date: project?.start_date || undefined,
    end_date: project?.end_date || undefined,
    budget: project?.budget || "",
  }

  const form = useForm<ProjectFormSchema>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
    mode: "onBlur",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (values: ProjectFormSchema) => {
    setIsLoading(true)
    setError(null)
    try {
      const dataToSubmit = {
        ...values,
        start_date: values.start_date || undefined,
        end_date: values.end_date || undefined,
        budget: values.budget ? Number(values.budget) : undefined,
      }
      let result
      if (project?.id) {
        result = await updateProjectAction(project.id, dataToSubmit)
      } else {
        // result = await createProjectAction(dataToSubmit) // Décommente si le fichier existe
      }
      if (result && !result.success) {
        setError(result.error || "Une erreur est survenue")
        return
      }
      if (router) {
        router.push("/dashboard/projects")
        router.refresh()
      }
      if (onSuccess) onSuccess()
    } catch (err) {
      setError("Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    form,
    onSubmit,
    isLoading,
    error,
    setError,
  }
} 