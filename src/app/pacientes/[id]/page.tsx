// src/app/pacientes/[id]/page.tsx

import { getPatientDetails } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, User, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientDataTable } from "../patient-data-table"; // Reutilizamos nossa tabela!
import { historyColumns } from "./history-columns";

export const revalidate = 0;

interface PageProps {
  params: { id: string };
}

export default async function PatientDetailPage({ params }: PageProps) {
  const patientDetails = await getPatientDetails(params.id);

  if (!patientDetails) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/pacientes" className="flex items-center text-sm text-muted-foreground hover:text-primary">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar para a lista de pacientes
        </Link>
        <h1 className="text-3xl font-bold mt-2">{patientDetails.nome}</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Coluna de Informações Pessoais */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User size={20}/> Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>CPF:</strong> {patientDetails.cpf || 'Não informado'}</p>
            <p><strong>Telefone:</strong> {patientDetails.telefone || 'Não informado'}</p>
            <p><strong>Data de Nasc.:</strong> {patientDetails.data_nascimento ? new Date(patientDetails.data_nascimento + 'T00:00:00').toLocaleDateString('pt-BR') : 'Não informado'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Histórico */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Calendar size={24}/>
          Histórico de Consultas
        </h2>
        {/* Passamos as colunas e os dados para nossa tabela reutilizável */}
        <PatientDataTable columns={historyColumns} data={patientDetails.consultas} pageCount={1} />
      </div>
    </div>
  );
}