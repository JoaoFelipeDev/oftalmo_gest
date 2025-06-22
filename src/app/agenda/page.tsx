// src/app/agenda/page.tsx

import { AgendaView } from "@/components/agenda/AgendaView";

import { NewConsultationDialog } from "@/components/agenda/NewConsultationDialog"; 
import { getConsultationsForCalendar, getDoctorsAsResources } from "@/lib/data";

export const revalidate = 0;

export default async function AgendaPage() {
  const eventsPromise = getConsultationsForCalendar();
  const doctorsPromise = getDoctorsAsResources();

  const [events, doctors] = await Promise.all([eventsPromise, doctorsPromise]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agenda</h1>
        <div>
           <NewConsultationDialog medicos={doctors} />
        </div>
      </div>
      
      <div className="flex-1">
        <AgendaView events={events} resources={doctors} />
      </div>
    </div>
  );
}