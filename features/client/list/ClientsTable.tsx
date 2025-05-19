"use client"

import { useClientsTable } from "@/features/client/list/hooks/useClientsTable"
import { ClientsTableView } from "@/features/client/list/ui/ClientsTableView"
import { Client } from "@/features/client/shared/types/client.types"

export function ClientsTable({ clients }: { clients: Client[] }) {
  const {
    searchTerm,
    setSearchTerm,
    deleteDialogOpen,
    setDeleteDialogOpen,
    clientToDelete,
    setClientToDelete,
    filteredClients,
    handleDelete,
    router,
  } = useClientsTable(clients)



  return (
    <ClientsTableView
      filteredClients={filteredClients}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      deleteDialogOpen={deleteDialogOpen}
      setDeleteDialogOpen={setDeleteDialogOpen}
      clientToDelete={clientToDelete}
      setClientToDelete={setClientToDelete}
      handleDelete={handleDelete}
      router={router}
    />
  )
}
