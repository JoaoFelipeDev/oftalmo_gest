// src/app/configuracoes/convenios/ConvenioForm.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createConvenio } from './actions';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Um pequeno componente para o botão, para que ele possa saber o status do formulário
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Adicionando...' : 'Adicionar Convênio'}
    </Button>
  );
}

export function ConvenioForm() {
    const initialState: { error: string | null; success: string | null } = { error: null, success: null };
  const [state, dispatch] = useFormState(createConvenio, initialState);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={dispatch} className="mb-6 flex items-center gap-4 p-4 border rounded-lg bg-card">
      <Input name="nome" placeholder="Nome do novo convênio" required className="flex-1" />
      <input type="hidden" name="ativo" value="true" />
      <SubmitButton />
    </form>
  );
}