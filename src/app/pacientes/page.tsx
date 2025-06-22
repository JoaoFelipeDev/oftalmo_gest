/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/pacientes/page.tsx

import { getPaginatedPatients, Patient } from '@/lib/data';
import { PatientDataTable } from './patient-data-table';
import { columns } from './columns';

export const revalidate = 0;

interface PacientesPageProps {
  searchParams: {
    query?: string;
    page?: string;
  };
}

export default async function PacientesPage({ searchParams }: PacientesPageProps) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const { patients, pageCount } = await getPaginatedPatients({ query, page: currentPage });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestão de Pacientes</h1>
      {/* Passamos os dados para o componente da tabela, que será um client component */}
      <PatientDataTable columns={columns} data={patients} pageCount={pageCount} />
    </div>
  );
}