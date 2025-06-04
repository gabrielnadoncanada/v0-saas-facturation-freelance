'use client';

import { useRef, useState } from 'react';
import { Task } from '@/features/task/shared/types/task.types';
import { differenceInCalendarDays, addDays, format, addWeeks, addMonths } from 'date-fns';

type ZoomLevel = 'days' | 'weeks' | 'months' | 'quarters';

const ZOOM_DAY_WIDTH: Record<ZoomLevel, number> = {
  days: 40,
  weeks: 20,
  months: 6,
  quarters: 3,
};

const statusColors: Record<string, string> = {
  pending: 'bg-muted',
  in_progress: 'bg-blue-500',
  completed: 'bg-green-500',
  blocked: 'bg-red-500',
};

export function TaskGantt({
  tasks,
  projectStartDate,
}: {
  tasks: Task[];
  projectStartDate?: string;
}) {
  if (!projectStartDate) {
    return <p className="text-sm text-muted-foreground">Aucune date de début du projet</p>;
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<ZoomLevel>('days');

  const start = new Date(projectStartDate);
  const endDates = tasks.filter((t) => t.due_date).map((t) => new Date(t.due_date!));
  const projectEnd = endDates.length
    ? new Date(Math.max(...endDates.map((d) => d.getTime())))
    : start;
  const totalDays = Math.max(differenceInCalendarDays(projectEnd, start) + 1, 1);

  const dayWidth = ZOOM_DAY_WIDTH[zoom];
  const totalWidth = totalDays * dayWidth;

  const generateTicks = () => {
    const ticks: Date[] = [];
    let current = new Date(start);
    while (current <= projectEnd) {
      ticks.push(new Date(current));
      switch (zoom) {
        case 'days':
          current = addDays(current, 1);
          break;
        case 'weeks':
          current = addWeeks(current, 1);
          break;
        case 'months':
          current = addMonths(current, 1);
          break;
        case 'quarters':
          current = addMonths(current, 3);
          break;
      }
    }
    return ticks;
  };

  const ticks = generateTicks();

  const scrollToToday = () => {
    const today = new Date();
    const offset =
      differenceInCalendarDays(today, start) * dayWidth -
      (containerRef.current?.clientWidth || 0) / 2;
    if (containerRef.current) containerRef.current.scrollLeft = Math.max(offset, 0);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="space-x-2">
          <button className="text-xs px-2 py-1 border rounded" onClick={() => setZoom('days')}>
            Jour
          </button>
          <button className="text-xs px-2 py-1 border rounded" onClick={() => setZoom('weeks')}>
            Semaine
          </button>
          <button className="text-xs px-2 py-1 border rounded" onClick={() => setZoom('months')}>
            Mois
          </button>
          <button className="text-xs px-2 py-1 border rounded" onClick={() => setZoom('quarters')}>
            Trimestre
          </button>
        </div>
        <button className="text-xs px-2 py-1 border rounded" onClick={scrollToToday}>
          Aujourd'hui
        </button>
      </div>

      <div ref={containerRef} className="overflow-x-auto">
        <div style={{ width: totalWidth }} className="space-y-2">
          <div className="relative h-6 flex text-xs">
            {ticks.map((date, idx) => {
              let label = format(date, 'dd/MM');
              if (zoom === 'weeks') label = 'S' + format(date, 'I');
              if (zoom === 'months') label = format(date, 'MMM yyyy');
              if (zoom === 'quarters')
                label = `T${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`;
              const width =
                zoom === 'days'
                  ? dayWidth
                  : zoom === 'weeks'
                    ? 7 * dayWidth
                    : zoom === 'months'
                      ? 30 * dayWidth
                      : 90 * dayWidth;
              return (
                <div key={idx} style={{ width }} className="border-r text-center">
                  {label}
                </div>
              );
            })}
          </div>

          {tasks.map((task) => {
            if (!task.due_date) return null;
            const taskEnd = new Date(task.due_date);
            const offset = differenceInCalendarDays(taskEnd, start);
            const width = dayWidth * (offset + 1);
            return (
              <div key={task.id} className="flex items-center space-x-2">
                <span className="w-40 text-sm truncate">{task.name}</span>
                <div className="relative" style={{ width: totalWidth }}>
                  <div
                    className={`absolute h-4 rounded-sm ${statusColors[task.status] || 'bg-primary'}`}
                    style={{ left: offset * dayWidth, width }}
                  />
                </div>
                <span className="w-24 text-sm text-right">{format(taskEnd, 'dd/MM/yyyy')}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
