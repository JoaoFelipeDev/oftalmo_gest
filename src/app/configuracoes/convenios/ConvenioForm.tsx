// src/app/configuracoes/convenios/ConvenioForm.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { type Convenio } from '@/lib/data';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createConvenio, updateConvenio } from './actions';

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (isEditing ? 'Salvando...' : 'Criando...') : (isEditing ? 'Salvar Alterações' : 'Adicionar Convênio')}
    </Button>
  );
}

interface ConvenioFormProps {
  convenio?: Convenio;
  onSuccess: () => void;
}

export function ConvenioForm({ convenio, onSuccess }: ConvenioFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const action = convenio ? updateConvenio : createConvenio;
  const [state, dispatch] = useFormState(action, { error: '', success: null });

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
      onSuccess();
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state, onSuccess]);

  return (
    <form ref={formRef} action={dispatch} className="flex flex-col gap-4">
      {convenio && <input type="hidden" name="id" value={convenio.id} />}
      <Input name="nome" placeholder="Nome do convênio" defaultValue={convenio?.nome} required />
      <input type="hidden" name="ativo" value={String(convenio?.ativo ?? true)} />
      <SubmitButton isEditing={!!convenio} />
    </form>
  );
}