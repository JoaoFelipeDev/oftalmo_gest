/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/pacientes/AddPatientDialog.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription
} from '@/components/ui/dialog';
import { PatientForm } from './PatientForm';
import { PlusCircle, Edit } from 'lucide-react';
import { type Patient } from '@/lib/data';

interface AddPatientDialogProps {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  patientToEdit?: Patient;
  // Adicionamos um children para o gatilho, tornando-o mais flexível
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
  
  const formId = isEditing ? `edit-patient-form-${patientToEdit?.id}` : "add-patient-form";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {/* Se passarmos um 'children', ele será o gatilho. Senão, usamos o botão padrão. */}
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
            Preencha os dados abaixo. Campos com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>
        
        <PatientForm 
          formId={formId} 
          onSuccess={() => onOpenChange(false)}
          initialData={patientToEdit}
        />
        
        <DialogFooter>
          {/* Este botão agora está fora do <form>, mas o aciona através da prop 'form' */}
          <Button type="submit" form={formId}>
            {isEditing ? 'Salvar Alterações' : 'Salvar Paciente'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}