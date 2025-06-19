/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/agenda/AgendaView.tsx
'use client';

import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
// CORREÇÃO 1: Import com chaves
import { ptBR } from 'date-fns/locale/pt-BR';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: ptBR }),
  getDay,
  locales,
});

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  // CORREÇÃO 2: Trocamos 'any' por 'string'
  resource?: string;
}

interface AgendaViewProps {
  events: CalendarEvent[];
}

export function AgendaView({ events }: AgendaViewProps) {
  return (
    <div className="h-[75vh] bg-card p-4 rounded-lg border">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.WEEK}
        views={[Views.DAY, Views.WEEK, Views.MONTH]}
        culture='pt-BR'
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
        eventPropGetter={(_event) => { // CORREÇÃO 3: Adicionado o underscore
          const style = {
            backgroundColor: '#3F2873',
            borderRadius: '5px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block'
          };
          return {
            style: style
          };
        }}
      />
    </div>
  );
}