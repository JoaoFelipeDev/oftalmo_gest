// src/components/pacientes/PatientConvenioDialog.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { linkConvenioToPatient } from '@/app/pacientes/[id]/actions';
import { PlusCircle } from 'lucide-react';
import { type Convenio } from '@/lib/data';

// Componente para o botão de submit, para mostrar o estado de 'pending'
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Adicionando...' : 'Adicionar'}
    </Button>
  );
}

interface PatientConvenioDialogProps {
  patientId: string;
  conveniosList: Convenio[];
}

export function PatientConvenioDialog({ patientId, conveniosList }: PatientConvenioDialogProps) {
  const initialState = { error: null, success: null };
  const [state, formAction] = useFormState(linkConvenioToPatient, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
      formRef.current?.reset(); // Limpa o formulário após o sucesso
      setIsOpen(false);
    }
    if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Convênio
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Convênio ao Paciente</DialogTitle>
          <DialogDescription>
            Selecione o convênio e preencha os dados do plano.
          </DialogDescription>
        </DialogHeader>
        {/* Usamos um formulário nativo com a Server Action */}
        <form ref={formRef} action={formAction} className="space-y-4 py-4">
          {/* Campo oculto para enviar o ID do paciente */}
          <input type="hidden" name="paciente_id" value={patientId} />
          
          <div>
            <Label htmlFor="convenio_id">Convênio</Label>
            <Select name="convenio_id" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um convênio" />
              </SelectTrigger>
              <SelectContent>
                {conveniosList.map(convenio => (
                  <SelectItem key={convenio.id} value={convenio.id}>{convenio.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="plano">Plano (Opcional)</Label>
            <Input name="plano" id="plano" placeholder="Ex: Enfermaria" />
          </div>

          <div>
            <Label htmlFor="numero_matricula">Nº da Matrícula (Opcional)</Label>
            <Input name="numero_matricula" id="numero_matricula" placeholder="0123456789" />
          </div>
          
          <DialogFooter>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}