import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate, formatDuration } from "@/shared/lib/utils"
import { Play, Plus, Trash } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TimeEntryForm } from "@/features/project/shared/TimeEntryForm"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

interface TimeTrackingListViewProps {
  timeByTask: any[]
  tasks: any[]
  addTimeDialogOpen: boolean
  setAddTimeDialogOpen: (b: boolean) => void
  deleteDialogOpen: boolean
  setDeleteDialogOpen: (b: boolean) => void
  entryToDelete: string | null
  setEntryToDelete: (id: string | null) => void
  selectedTaskId: string | null
  setSelectedTaskId: (id: string | null) => void
  handleDeleteEntry: () => void
  startTimeTracking: (taskId: string) => void
  onSuccess: () => void
  clientId: string
}

export const TimeTrackingListView: React.FC<TimeTrackingListViewProps> = ({
  timeByTask,
  tasks,
  addTimeDialogOpen,
  setAddTimeDialogOpen,
  deleteDialogOpen,
  setDeleteDialogOpen,
  entryToDelete,
  setEntryToDelete,
  selectedTaskId,
  setSelectedTaskId,
  handleDeleteEntry,
  startTimeTracking,
  onSuccess,
  clientId,
}) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium">Suivi du temps par tâche</h3>
      <Dialog open={addTimeDialogOpen} onOpenChange={setAddTimeDialogOpen}>
        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter du temps
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une entrée de temps</DialogTitle>
          </DialogHeader>
          <TimeEntryForm
            tasks={tasks}
            clientId={clientId}
            initialTaskId={selectedTaskId}
            onSuccess={() => {
              setAddTimeDialogOpen(false)
              setSelectedTaskId(null)
              onSuccess()
            }}
          />
        </DialogContent>
      </Dialog>
    </div>

    <div className="space-y-4">
      {timeByTask.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-muted-foreground">Aucune tâche avec suivi du temps pour ce projet.</p>
          </CardContent>
        </Card>
      ) : (
        timeByTask.map((task) => (
          <Card key={task.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">{task.name}</CardTitle>
                <Button variant="outline" size="sm" onClick={() => startTimeTracking(task.id)}>
                  <Play className="mr-2 h-3 w-3" />
                  Suivre le temps
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm mb-4">
                Temps total: <span className="font-medium">{formatDuration(task.totalTime)}</span>
              </div>

              {task.entries.length > 0 ? (
                <div className="space-y-2">
                  {task.entries.map((entry: any) => (
                    <div key={entry.id} className="flex justify-between items-center py-2 border-t">
                      <div>
                        <div className="font-medium">{entry.description}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(entry.start_time)} • {formatDuration(entry.duration)}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Badge className="mr-2">{entry.billable ? "Facturable" : "Non facturable"}</Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEntryToDelete(entry.id)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aucune entrée de temps pour cette tâche.</p>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>

    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut pas être annulée. Cela supprimera définitivement cette entrée de temps.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteEntry} className="bg-red-600 hover:bg-red-700">
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
) 