import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteTimeEntryAction } from '../actions/deleteTimeEntry.action'
import { TimeEntry } from '@/features/time-tracking/shared/types/timeEntry.types'

export function useTimeEntriesTable(entries: TimeEntry[]) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredEntries = entries.filter(
    (entry) =>
      entry.project?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.task?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.description || '').toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async () => {
    if (!entryToDelete) return
    setIsDeleting(true)
    try {
      const result = await deleteTimeEntryAction(entryToDelete)
      if (result.success) {
        router.refresh()
      } else {
        console.error(result.error)
      }
    } catch (error) {
      console.error('Failed to delete time entry:', error)
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setEntryToDelete(null)
    }
  }

  return {
    searchTerm,
    setSearchTerm,
    deleteDialogOpen,
    setDeleteDialogOpen,
    entryToDelete,
    setEntryToDelete,
    isDeleting,
    filteredEntries,
    handleDelete,
    router,
  }
}
