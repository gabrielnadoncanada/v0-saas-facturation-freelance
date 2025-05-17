import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { DateTimePicker } from "@/components/ui/date-time-picker"

interface TimeEntryFormViewProps {
  formData: any
  handleChange: (name: string, value: any) => void
  handleSubmit: (e: React.FormEvent) => void
  isLoading: boolean
  error: string | null
  tasks: any[]
}

export const TimeEntryFormView: React.FC<TimeEntryFormViewProps> = ({
  formData,
  handleChange,
  handleSubmit,
  isLoading,
  error,
  tasks,
}) => (
  <form onSubmit={handleSubmit} className="space-y-4">
    {error && (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )}

    <div className="space-y-2">
      <Label htmlFor="task_id">Tâche *</Label>
      <Select value={formData.task_id} onValueChange={(value) => handleChange("task_id", value)} required>
        <SelectTrigger id="task_id">
          <SelectValue placeholder="Sélectionner une tâche" />
        </SelectTrigger>
        <SelectContent>
          {tasks.map((task: any) => (
            <SelectItem key={task.id} value={task.id}>
              {task.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label htmlFor="description">Description *</Label>
      <Textarea
        id="description"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        required
        rows={2}
      />
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="start_time">Date et heure de début</Label>
        <DateTimePicker date={formData.start_time} setDate={(date) => handleChange("start_time", date)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="end_time">Date et heure de fin</Label>
        <DateTimePicker date={formData.end_time} setDate={(date) => handleChange("end_time", date)} />
      </div>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="hourly_rate">Taux horaire (€)</Label>
        <Input
          id="hourly_rate"
          type="number"
          step="0.01"
          min="0"
          value={formData.hourly_rate}
          onChange={(e) => handleChange("hourly_rate", Number(e.target.value))}
          required
        />
      </div>
      <div className="flex items-center space-x-2 pt-8">
        <Switch
          id="billable"
          checked={formData.billable}
          onCheckedChange={(checked) => handleChange("billable", checked)}
        />
        <Label htmlFor="billable">Facturable</Label>
      </div>
    </div>

    <div className="flex justify-end">
      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Enregistrer
      </Button>
    </div>
  </form>
) 