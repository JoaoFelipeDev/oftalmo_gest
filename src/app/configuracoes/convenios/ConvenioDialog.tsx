/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/configuracoes/convenios/ConvenioDialog.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { ConvenioForm } from './ConvenioForm';
import { type Convenio } from '@/lib/data';

interface ConvenioDialogProps {
  convenio?: Convenio;
  children: React.ReactNode;
}

export function ConvenioDialog({ convenio, children }: ConvenioDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{convenio ? 'Editar Convênio' : 'Adicionar Novo Convênio'}</DialogTitle>
        </DialogHeader>
        <ConvenioForm convenio={convenio} onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}