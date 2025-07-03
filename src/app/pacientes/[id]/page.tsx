// src/app/pacientes/[id]/page.tsx

import { getPatientDetails, getAllConvenios } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, User, Calendar, ShieldCheck } from "lucide-react";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { PatientDataTable } from "../patient-data-table";
import { historyColumns } from "./history-columns";
import { PatientConvenioDialog } from "@/components/pacientes/PatientConvenioDialog";

export const revalidate = 0;

interface PageProps {
  params: { id: string };
}

export default async function PatientDetailPage({ params }: PageProps) {
  const [patientDetails, conveniosList] = await Promise.all([
    getPatientDetails(params.id),
    getAllConvenios(),
  ]);

  if (!patientDetails) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <Link
          href="/pacientes"
          className="flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar para a lista de pacientes
        </Link>
        <h1 className="text-3xl font-bold mt-2">{patientDetails.nome}</h1>
      </div>

      {/* Informações pessoais */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} /> Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>CPF:</strong> {patientDetails.cpf || "Não informado"}</p>
            <p><strong>Telefone:</strong> {patientDetails.telefone || "Não informado"}</p>
            <p>
              <strong>Data de Nasc.:</strong>{" "}
              {patientDetails.data_nascimento
                ? new Date(patientDetails.data_nascimento + "T00:00:00").toLocaleDateString("pt-BR")
                : "Não informado"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Convênios */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck size={24} />
            Convênios do Paciente
          </h2>
          <PatientConvenioDialog patientId={patientDetails.id} conveniosList={conveniosList} />
        </div>
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Convênio</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Matrícula</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patientDetails.paciente_convenios.length > 0 ? (
                patientDetails.paciente_convenios.map((pc) => (
                  <TableRow key={pc.id}>
                    <TableCell>{pc.convenios?.nome || "—"}</TableCell>
                    <TableCell>{pc.plano || "—"}</TableCell>
                    <TableCell>{pc.numero_matricula || "—"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Nenhum convênio vinculado a este paciente.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Histórico de Consultas */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Calendar size={24} />
          Histórico de Consultas
        </h2>
        <PatientDataTable
          columns={historyColumns}
          data={patientDetails.consultas}
          pageCount={1}
          showControls={false}
        />
      </div>
    </div>
  );
}
