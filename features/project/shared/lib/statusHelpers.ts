// Project and Task status helpers for reuse across project feature

// Optionally, you can type status as string or define union types if available

export function getStatusLabel(status: string): string {
  switch (status) {
    case "active":
      return "Actif"
    case "completed":
      return "Terminé"
    case "on_hold":
      return "En pause"
    case "cancelled":
      return "Annulé"
    default:
      return status
  }
}

export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800"
    case "completed":
      return "bg-blue-100 text-blue-800"
    case "on_hold":
      return "bg-yellow-100 text-yellow-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function getTaskStatusLabel(status: string): string {
  switch (status) {
    case "pending":
      return "À faire"
    case "in_progress":
      return "En cours"
    case "completed":
      return "Terminée"
    case "blocked":
      return "Bloquée"
    default:
      return status
  }
} 