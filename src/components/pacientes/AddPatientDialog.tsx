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
  children?: React.ReactNode; 
}

export function AddPatientDialog({ 
  isOpen: controlledIsOpen, 
  onOpenChange: controlledOnOpenChange,
  patientToEdit,
  children,
}: AddPatientDialogProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isControlled = controlledIsOpen !== undefined && controlledOnOpenChange !== undefined;
  const isEditing = !!patientToEdit;
  
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setInternalIsOpen;
  
  // ID único para nosso formulário, para ser acionado pelo botão no rodapé
  const formId = isEditing ? `edit-patient-form-${patientToEdit?.id}` : "add-patient-form";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children ? children : (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Paciente
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Paciente' : 'Cadastrar Novo Paciente'}</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo.
          </DialogDescription>
        </DialogHeader>
        
        <PatientForm 
          formId={formId} 
          onSuccess={() => onOpenChange(false)}
          initialData={patientToEdit}
        />
        
        {/* BOTÃO DE SALVAR AGORA FICA AQUI, NO RODAPÉ, CONECTADO PELO ID */}
        <DialogFooter>
          <Button type="submit" form={formId}>
            {isEditing ? 'Salvar Alterações' : 'Salvar Paciente'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}