"use client"

import { useClientsTable } from "./hooks/useClientsTable"
import { ClientsTableView } from "./ui/ClientsTableView"
import { Client } from "@/shared/types/clients/client"

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
