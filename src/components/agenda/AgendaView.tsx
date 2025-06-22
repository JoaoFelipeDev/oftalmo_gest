/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/agenda/AgendaView.tsx
'use client';

import { Calendar, dateFnsLocalizer, Views, type EventPropGetter } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { type CalendarEvent, type Resource } from '@/lib/data';
import { type CSSProperties } from 'react';

const locales = { 'pt-BR': ptBR };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek: () => startOfWeek(new Date(), { locale: ptBR }), getDay, locales });

interface AgendaViewProps {
  events: CalendarEvent[];
  resources: Resource[];
}

export function AgendaView({ events, resources }: AgendaViewProps) {
  
  const eventStyleGetter: EventPropGetter<CalendarEvent> = (_event, _start, _end, _isSelected) => {
    const style: CSSProperties = {
      backgroundColor: 'hsl(var(--primary))',
      borderRadius: '5px',
      opacity: 0.8,
      color: 'hsl(var(--primary-foreground))',
      border: '0px',
      display: 'block'
    };
    return { style: style };
  };

  return (
    <div className="h-[75vh] bg-card p-4 rounded-lg border shadow-sm">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.DAY}
        views={[Views.DAY, Views.WEEK, Views.MONTH]}
        culture='pt-BR'
        resources={resources}
        resourceIdAccessor="id"
        resourceTitleAccessor="title"
        resourceAccessor="resourceId"
        messages={{
          next: "Próximo",
          previous: "Anterior",
          today: "Hoje",
          month: "Mês",
          week: "Semana",
          day: "Dia",
          agenda: "Agenda",
          date: "Data",
          time: "Hora",
          event: "Evento",
          noEventsInRange: "Não há eventos neste período.",
          showMore: total => `+ Ver mais (${total})`
        }}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
}