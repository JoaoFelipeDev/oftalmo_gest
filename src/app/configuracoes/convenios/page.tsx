// src/app/configuracoes/convenios/page.tsx

import { getConvenios } from "@/lib/data";
import { columns } from "./columns";
import { ConveniosDataTable } from "./convenios-data-table";
// 1. Importamos nosso novo componente de formulário
import { ConvenioForm } from "./ConvenioForm";

export const revalidate = 0;

export default async function ConveniosPage() {
  const convenios = await getConvenios();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestão de Convênios</h1>
      </div>
      
      {/* 2. Usamos o novo componente de formulário aqui */}
      <ConvenioForm />
      
      <ConveniosDataTable columns={columns} data={convenios} />
    </div>
  );
}