'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Task } from '@/features/task/shared/types/task.types';
import { format, eachDayOfInterval, startOfWeek, endOfWeek, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';

export function TaskCalendar({ tasks }: { tasks: Task[] }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month' | 'agenda'>('month');

  const tasksByDate = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    if (!task.due_date) return acc;
    const key = format(new Date(task.due_date), 'yyyy-MM-dd');
    if (!acc[key]) acc[key] = [];
    acc[key].push(task);
    return acc;
  }, {});

  const renderTask = (task: Task) => (
    <div key={task.id} className="p-1 rounded-md bg-muted text-xs">
      {task.name}
    </div>
  );

  const weekDays = eachDayOfInterval({
    start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
    end: endOfWeek(selectedDate, { weekStartsOn: 1 }),
  });

  const agendaTasks = tasks
    .filter((t) => t.due_date)
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime());

  return (
    <div className="space-y-4">
      <Tabs value={view} onValueChange={(v) => setView(v as any)}>
        <TabsList>
          <TabsTrigger value="day">Jour</TabsTrigger>
          <TabsTrigger value="week">Semaine</TabsTrigger>
          <TabsTrigger value="month">Mois</TabsTrigger>
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
        </TabsList>
      </Tabs>

      {view === 'month' && (
        <div className="flex flex-col md:flex-row gap-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(d) => d && setSelectedDate(d)}
            locale={fr}
            className="w-auto"
          />
          <div className="flex-1 space-y-2 overflow-y-auto max-h-[400px]">
            {(tasksByDate[format(selectedDate, 'yyyy-MM-dd')] || []).length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune tâche</p>
            ) : (
              (tasksByDate[format(selectedDate, 'yyyy-MM-dd')] || []).map(renderTask)
            )}
          </div>
        </div>
      )}

      {view === 'week' && (
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayTasks = tasksByDate[dateKey] || [];
            return (
              <div key={dateKey} className="border rounded-md p-2 flex flex-col space-y-1">
                <span className={isToday(day) ? 'font-semibold text-primary' : 'font-medium'}>
                  {format(day, 'dd/MM')}
                </span>
                {dayTasks.length === 0 ? (
                  <span className="text-xs text-muted-foreground">-</span>
                ) : (
                  dayTasks.map(renderTask)
                )}
              </div>
            );
          })}
        </div>
      )}

      {view === 'day' && (
        <div className="space-y-2">
          <h4 className="font-semibold">{format(selectedDate, 'PP', { locale: fr })}</h4>
          {(tasksByDate[format(selectedDate, 'yyyy-MM-dd')] || []).length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune tâche</p>
          ) : (
            (tasksByDate[format(selectedDate, 'yyyy-MM-dd')] || []).map(renderTask)
          )}
        </div>
      )}

      {view === 'agenda' && (
        <div className="space-y-2 overflow-y-auto max-h-[400px]">
          {agendaTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune tâche</p>
          ) : (
            agendaTasks.map((task) => (
              <div key={task.id} className="border rounded-md p-2">
                <p className="text-sm font-medium">
                  {task.due_date &&
                    `${format(new Date(task.due_date), 'dd/MM', { locale: fr })} : `}
                  {task.name}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
