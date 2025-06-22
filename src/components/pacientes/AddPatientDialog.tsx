// src/components/pacientes/AddPatientDialog.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription
} from '@/components/ui/dialog';
import { PatientForm } from './PatientForm';
import { PlusCircle } from 'lucide-react';
import { type Patient } from '@/lib/data';

interface AddPatientDialogProps {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  patientToEdit?: Patient;
}

export function AddPatientDialog({ 
  isOpen: controlledIsOpen, 
  onOpenChange: controlledOnOpenChange,
  patientToEdit,
}: AddPatientDialogProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isControlled = controlledIsOpen !== undefined && controlledOnOpenChange !== undefined;
  const isEditing = !!patientToEdit;
  
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setInternalIsOpen;
  
  // ID único para nosso formulário de paciente, para ser acionado pelo botão no rodapé
  const formId = isEditing ? `edit-patient-form-${patientToEdit?.id}` : "add-patient-form";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {!isControlled && (
        <DialogTrigger asChild>
          {isEditing ? (
             <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-muted w-full">
                Editar
              </div>
          ) : (
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Paciente
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Paciente' : 'Cadastrar Novo Paciente'}</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo. Campos com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>
        
        <PatientForm 
          formId={formId} 
          onSuccess={() => onOpenChange(false)}
          initialData={patientToEdit}
        />
        
        {/* BOTÃO DE SALVAR AGORA FICA AQUI, FORA DO FORMULÁRIO, MAS CONECTADO PELO ID */}
        <DialogFooter>
          <Button type="submit" form={formId}>
            {isEditing ? 'Salvar Alterações' : 'Salvar Paciente'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}