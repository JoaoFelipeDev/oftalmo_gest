// src/app/agenda/page.tsx

import { AgendaView } from "@/components/agenda/AgendaView";
import { getConsultationsForCalendar } from "@/lib/data";

export const revalidate = 0; // Garante que a agenda sempre busque os dados mais recentes

export default async function AgendaPage() {
  const events = await getConsultationsForCalendar();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agenda</h1>
        <div>
          {/* Aqui podemos adicionar botões para criar novas consultas no futuro */}
        </div>
      </div>
      
      <AgendaView events={events} />
    </div>
  );
}