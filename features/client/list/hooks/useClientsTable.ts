import { useState } from "react"
import { deleteClientAction } from "@/features/client/delete/actions/deleteClient.action"
import { Client } from "@/features/client/shared/types/client.types"
import { useRouter } from "next/navigation"

export function useClientsTable(clients: Client[]) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<string | null>(null)

  console.log(clients)
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async () => {
    if (!clientToDelete) return
    const result = await deleteClientAction(clientToDelete)
    if (result.success) {
      router.refresh()
    }
    setDeleteDialogOpen(false)
    setClientToDelete(null)
  }

  return {
    searchTerm,
    setSearchTerm,
    deleteDialogOpen,
    setDeleteDialogOpen,
    clientToDelete,
    setClientToDelete,
    filteredClients,
    handleDelete,
    router,
  }
} 