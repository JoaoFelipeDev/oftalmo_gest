// src/components/pacientes/EditPatientDialog.tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PatientForm } from './PatientForm';
import { type Patient } from '@/lib/data';

interface EditPatientDialogProps {
  patient: Patient;
  children: React.ReactNode; // O gatilho (trigger) será passado como filho
}

export function EditPatientDialog({ patient, children }: EditPatientDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Usamos o 'children' como o gatilho, tornando o componente mais flexível */}
      <div onClick={() => setIsOpen(true)} className="w-full">
        {children}
      </div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Paciente</DialogTitle>
        </DialogHeader>
        {/* Passamos os dados do paciente para o formulário */}
        <PatientForm initialData={patient} onSuccess={() => setIsOpen(false)} formId={''} />
      </DialogContent>
    </Dialog>
  );
}