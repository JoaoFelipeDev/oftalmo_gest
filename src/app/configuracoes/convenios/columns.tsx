/* eslint-disable @typescript-eslint/no-unused-expressions */
// src/app/configuracoes/convenios/columns.tsx
'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { type Convenio } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
// 1. O import agora está correto
import { updateConvenioStatus, deleteConvenio } from './actions'; 
import { toast } from 'sonner';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ConvenioDialog } from './ConvenioDialog';
import { DeleteConfirmationDialog } from '@/components/shared/DeleteConfirmationDialog';

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
      // 2. A chamada da função agora corresponde ao import
      const handleStatusChange = async (isChecked: boolean) => {
        const result = await updateConvenioStatus(convenio.id, isChecked);
        result.success ? toast.success(result.success) : toast.error(result.error);
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
  {
    id: 'actions',
    cell: ({ row }) => {
      const convenio = row.original;
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ConvenioDialog convenio={convenio}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit className="mr-2 h-4 w-4" /> Editar
                </DropdownMenuItem>
                      </ConvenioDialog>
                      <DeleteConfirmationDialog
                itemName={convenio.nome}
                onConfirm={async () => {
                  const result = await deleteConvenio(convenio.id);
                  result.success ? toast.success(result.success) : toast.error(result.error);
                }}
              >
                 <DropdownMenuItem
                  className="text-destructive focus:bg-destructive/30"
                  onSelect={(e) => e.preventDefault()} // Previne o fechamento do menu ao clicar
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Excluir
                </DropdownMenuItem>
              </DeleteConfirmationDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];