'use client';

import { useTimeEntriesTable } from '@/features/time-tracking/list/hooks/useTimeEntriesTable';
import { TimeEntriesTableView } from '@/features/time-tracking/list/ui/TimeEntriesTableView';
import { TimeEntry } from '@/features/time-tracking/shared/types/timeEntry.types';

export function TimeEntriesTable({ entries }: { entries: TimeEntry[] }) {
  const {
    searchTerm,
    setSearchTerm,
    deleteDialogOpen,
    setDeleteDialogOpen,
    setEntryToDelete,
    isDeleting,
    filteredEntries,
    handleDelete,
    router,
  } = useTimeEntriesTable(entries);

  return (
    <TimeEntriesTableView
      filteredEntries={filteredEntries}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      deleteDialogOpen={deleteDialogOpen}
      setDeleteDialogOpen={setDeleteDialogOpen}
      setEntryToDelete={setEntryToDelete}
      isDeleting={isDeleting}
      handleDelete={handleDelete}
      router={router}
    />
  );
}
