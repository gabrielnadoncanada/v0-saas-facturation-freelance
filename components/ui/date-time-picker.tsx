"use client"

import type React from "react"

import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface DateTimePickerProps {
  date: Date
  setDate: (date: Date) => void
  className?: string
}

export function DateTimePicker({ date, setDate, className }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date)
  const [timeValue, setTimeValue] = useState(format(date, "HH:mm"))

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setSelectedDate(newDate)

      // Conserver l'heure actuelle
      const hours = date.getHours()
      const minutes = date.getMinutes()
      newDate.setHours(hours)
      newDate.setMinutes(minutes)

      setDate(newDate)
    }
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeValue(e.target.value)

    if (e.target.value) {
      const [hours, minutes] = e.target.value.split(":").map(Number)
      const newDate = new Date(date)
      newDate.setHours(hours)
      newDate.setMinutes(minutes)
      setDate(newDate)
    }
  }

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground", className)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP", { locale: fr }) : <span>Sélectionner une date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} initialFocus locale={fr} />
        </PopoverContent>
      </Popover>
      <div className="relative">
        <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="time" value={timeValue} onChange={handleTimeChange} className="pl-8 w-[120px]" />
      </div>
    </div>
  )
}
