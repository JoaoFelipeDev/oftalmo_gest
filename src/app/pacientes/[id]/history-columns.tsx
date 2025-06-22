// src/app/pacientes/[id]/history-columns.tsx
'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { type PatientConsultation } from '@/lib/data';

export const historyColumns: ColumnDef<PatientConsultation>[] = [
  {
    accessorKey: 'data_consulta',
    header: 'Data',
    cell: ({ row }) => {
      const date = row.getValue('data_consulta') as string | null;
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  },
  {
    accessorKey: 'procedimento',
    header: 'Procedimento',
  },
  {
    // Acessando o nome do médico dentro do objeto aninhado
    accessorFn: (row) => row.medicos?.nome,
    id: 'medico',
    header: 'Médico',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
];