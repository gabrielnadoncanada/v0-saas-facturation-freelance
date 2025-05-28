"use client"

import { useProjectsTable, ProjectWithClient } from "@/features/project/list/hooks/useProjectsTable"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Edit, Eye, Package, Trash } from "lucide-react"
import { formatDate } from "@/shared/lib/utils"
import Link from "next/link"

export function ProjectsTable({ projects = [] }: { projects: ProjectWithClient[] }) {
  const {
    isDeleting,
    handleDelete,
    router,
  } = useProjectsTable()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Terminé</Badge>
      case "on_hold":
        return <Badge className="bg-yellow-100 text-yellow-800">En pause</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Annulé</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  const columns = [
    {
      header: "Nom",
      accessorKey: "name" as keyof ProjectWithClient,
      className: "font-medium"
    },
    {
      header: "Client",
      accessorKey: "clients" as keyof ProjectWithClient,
      cell: (project: ProjectWithClient) => project.clients?.name || "-"
    },
    {
      header: "Statut",
      accessorKey: "status" as keyof ProjectWithClient,
      cell: (project: ProjectWithClient) => getStatusBadge(project.status)
    },
    {
      header: "Date de début",
      accessorKey: "start_date" as keyof ProjectWithClient,
      cell: (project: ProjectWithClient) => project.start_date ? formatDate(project.start_date) : "-"
    },
    {
      header: "Date de fin",
      accessorKey: "end_date" as keyof ProjectWithClient,
      cell: (project: ProjectWithClient) => project.end_date ? formatDate(project.end_date) : "-"
    }
  ]

  const actions = [
    {
      label: "Voir",
      icon: <Eye className="h-4 w-4" />,
      onClick: (project: ProjectWithClient) => router.push(`/dashboard/projects/${project.id}`)
    },
    {
      label: "Modifier",
      icon: <Edit className="h-4 w-4" />,
      onClick: (project: ProjectWithClient) => router.push(`/dashboard/projects/${project.id}/edit`)
    },
    {
      label: "Supprimer",
      icon: <Trash className="h-4 w-4" />,
      className: "text-red-600",
    }
  ]

  const emptyState = (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Package className="h-10 w-10 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">Aucun projet</h3>
      <p className="mb-4 mt-2 text-sm text-muted-foreground">
        Vous n'avez pas encore ajouté de projets.
      </p>
      <Link href="/dashboard/projects/new">
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          Ajouter un projet
        </button>
      </Link>
    </div>
  )

  return (
    <DataTable
      data={projects}
      columns={columns}
      actions={actions}
      onRowClick={(project: ProjectWithClient) => router.push(`/dashboard/projects/${project.id}`)}
      searchPlaceholder="Rechercher des projets..."
      searchFields={["name"]}
      emptyState={emptyState}
      deleteAction={{
        title: "Êtes-vous sûr?",
        description: "Cette action ne peut pas être annulée. Cela supprimera définitivement le projet et toutes les tâches associées.",
        onDelete: handleDelete,
        isDeleting: isDeleting,
      }}
    />
  )
}
