// src/app/pacientes/columns.tsx
'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { type Patient } from '@/lib/data';
// 1. Importações de ícones corrigidas
import { MoreHorizontal, MessageSquare, Eye, Edit } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EditPatientDialog } from '@/components/pacientes/EditPatientDialog';
// 2. Importamos o Link do Next.js
import Link from 'next/link'; 

// Função auxiliar para formatar o link do WhatsApp
const openWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const whatsappNumber = cleanPhone.length >= 11 ? `55${cleanPhone}` : `55${cleanPhone}`;
    window.open(`https://wa.me/${whatsappNumber}`, '_blank');
};

export const columns: ColumnDef<Patient>[] = [
    {
        accessorKey: 'nome',
        header: 'Nome',
    },
    {
        accessorKey: 'telefone',
        header: 'Telefone',
    },
    {
        accessorKey: 'cpf',
        header: 'CPF',
    },
    {
        accessorKey: 'data_nascimento',
        header: 'Data de Nascimento',
        cell: ({ row }) => {
            const date = row.getValue('data_nascimento') as string | null;
            if (!date) return 'N/A';
            const formatted = new Date(date + 'T00:00:00').toLocaleDateString('pt-BR');
            return <div>{formatted}</div>;
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const paciente = row.original;
            return (
                <div className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            
                            {/* --- ESTRUTURA CORRIGIDA --- */}

                            {/* Item de WhatsApp */}
                            {paciente.telefone && (
                                <DropdownMenuItem onSelect={() => openWhatsApp(paciente.telefone!)}>
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    <span>WhatsApp</span>
                                </DropdownMenuItem>
                            )}

                            {/* Item de Ver Detalhes (com Link) */}
                            <DropdownMenuItem asChild>
                                <Link href={`/pacientes/${paciente.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    <span>Ver Detalhes</span>
                                </Link>
                            </DropdownMenuItem>

                            {/* Item de Editar (com o Dialog) */}
                            <EditPatientDialog patient={paciente}>
                                <div 
                                  // As classes abaixo imitam a aparência de um DropdownMenuItem
                                  className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-muted"
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Editar</span>
                                </div>
                            </EditPatientDialog>

                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];