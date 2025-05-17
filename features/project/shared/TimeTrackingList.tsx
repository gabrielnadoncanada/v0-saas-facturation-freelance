"use client"

import { useTimeTrackingList } from "./hooks/useTimeTrackingList"
import { TimeTrackingListView } from "./ui/TimeTrackingListView"

interface TimeTrackingListProps {
  timeEntries: any[]
  tasks: any[]
  projectId: string
  clientId: string
  onSuccess: () => void
}

export function TimeTrackingList({
  timeEntries,
  tasks,
  projectId,
  clientId,
  onSuccess,
}: TimeTrackingListProps) {
  const props = useTimeTrackingList({ timeEntries, tasks, projectId, clientId, onSuccess })
  return (
    <TimeTrackingListView
      timeByTask={props.timeByTask}
      tasks={tasks}
      addTimeDialogOpen={props.addTimeDialogOpen}
      setAddTimeDialogOpen={props.setAddTimeDialogOpen}
      deleteDialogOpen={props.deleteDialogOpen}
      setDeleteDialogOpen={props.setDeleteDialogOpen}
      entryToDelete={props.entryToDelete}
      setEntryToDelete={props.setEntryToDelete}
      selectedTaskId={props.selectedTaskId}
      setSelectedTaskId={props.setSelectedTaskId}
      handleDeleteEntry={props.handleDeleteEntry}
      startTimeTracking={props.startTimeTracking}
      onSuccess={onSuccess}
      clientId={clientId}
    />
  )
}
