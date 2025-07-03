// src/app/configuracoes/convenios/page.tsx
import { getConvenios } from "@/lib/data";
import { columns } from "./columns";
import { ConveniosDataTable } from "./convenios-data-table";
import { ConvenioDialog } from "./ConvenioDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export const revalidate = 0;

export default async function ConveniosPage() {
  const convenios = await getConvenios();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestão de Convênios</h1>
        <ConvenioDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Convênio
          </Button>
        </ConvenioDialog>
      </div>
      
      <ConveniosDataTable columns={columns} data={convenios} />
    </div>
  );
}