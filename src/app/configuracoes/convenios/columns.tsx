// src/app/configuracoes/convenios/columns.tsx
'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { type Convenio } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { updateConvenioStatus } from './actions';
import { toast } from 'sonner';

export const columns: ColumnDef<Convenio>[] = [
  {
    accessorKey: 'nome',
    header: 'Nome do Convênio',
  },
  {
    accessorKey: 'ativo',
    header: 'Status',
    cell: ({ row }) => {
      const convenio = row.original;
      const handleStatusChange = async (isChecked: boolean) => {
        const result = await updateConvenioStatus(convenio.id, isChecked);
        if (result.success) {
          toast.success(result.success);
        } else {
          toast.error(result.error);
          // Opcional: reverter o switch visualmente se a atualização falhar
        }
      };

      return (
        <div className="flex items-center space-x-2">
          <Switch
            id={`status-${convenio.id}`}
            checked={convenio.ativo}
            onCheckedChange={handleStatusChange}
          />
          <Badge variant={convenio.ativo ? 'default' : 'destructive'}>
            {convenio.ativo ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
      );
    },
  },
];