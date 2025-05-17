"use client"

import React from "react"
import { useTimeEntryForm } from "./hooks/useTimeEntryForm"
import { TimeEntryFormView } from "./ui/TimeEntryFormView"

export function TimeEntryForm({ tasks, clientId, initialTaskId, onSuccess }: any) {
  const {
    formData,
    handleChange,
    handleSubmit,
    isLoading,
    error,
  } = useTimeEntryForm({ tasks, clientId, initialTaskId, onSuccess })

  return (
    <TimeEntryFormView
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      tasks={tasks}
    />
  )
}
