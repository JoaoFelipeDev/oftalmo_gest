// src/components/pacientes/AddPatientDialog.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription
} from '@/components/ui/dialog';
import { PatientForm } from './PatientForm';
import { PlusCircle } from 'lucide-react';
import { type Patient } from '@/lib/data';
import { createPortal } from 'react-dom';

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
  const open = isControlled ? controlledIsOpen : internalIsOpen;
  const handleOpenChange = isControlled ? controlledOnOpenChange : setInternalIsOpen;

  // O trigger (botão) sempre aparece, o conteúdo do modal vai para o portal
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children ? children : (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Paciente
          </Button>
        )}
      </DialogTrigger>
      {typeof window !== 'undefined' && open && createPortal(
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Paciente</DialogTitle>
            <DialogDescription>
              Preencha os dados abaixo.
            </DialogDescription>
          </DialogHeader>
          <PatientForm 
            onSuccess={() => handleOpenChange(false)}
            initialData={patientToEdit}
          />
        </DialogContent>,
        document.body
      )}
    </Dialog>
  );
}