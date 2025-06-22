/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/agenda/NewConsultationDialog.tsx
'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { ConsultationForm } from './ConsultationForm';  // Vamos usar o formulário que já planejamos
import { type Resource } from '@/lib/data';
import { useState } from 'react';

// O componente agora recebe a lista de médicos para passar para o formulário
interface NewConsultationDialogProps {
  medicos: Resource[];
}

export function NewConsultationDialog({ medicos }: NewConsultationDialogProps) {
   const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog>
      {/* O DialogTrigger contém o nosso botão, que fica sempre visível */}
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Consulta
        </Button>
      </DialogTrigger>
      
      {/* O DialogContent é o modal que aparece ao clicar no Trigger */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agendar Nova Consulta</DialogTitle>
          <DialogDescription>
            Preencha os detalhes abaixo para criar um novo agendamento.
          </DialogDescription>
        </DialogHeader>
        
         <ConsultationForm medicos={medicos} onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}