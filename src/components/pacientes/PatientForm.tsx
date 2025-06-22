/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/pacientes/PatientForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createPatient, updatePatient } from '@/app/pacientes/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import InputMask from 'react-input-mask';
import { type Patient } from '@/lib/data';
import { toast } from 'sonner';

const patientSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  cpf: z.string().optional(),
  telefone: z.string().optional(),
  data_nascimento: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientSchema>;

// O formulário agora recebe um 'formId' para ser acionado externamente
interface PatientFormProps {
  formId: string;
  initialData?: Patient;
  onSuccess: () => void;
}

export function PatientForm({ formId, initialData, onSuccess }: PatientFormProps) {
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: initialData
      ? {
          id: initialData.id,
          nome: initialData.nome,
          // Converte null para string vazia, que o input aceita
          cpf: initialData.cpf ?? '',
          telefone: initialData.telefone ?? '',
          data_nascimento: initialData.data_nascimento ?? '',
        }
      : { nome: '', cpf: '', telefone: '', data_nascimento: '' },
  });

  const isEditing = !!initialData;

  const onSubmit = async (data: PatientFormValues) => {
    const formData = new FormData();
    if (isEditing && data.id) formData.append('id', data.id);
    formData.append('nome', data.nome);
    if (data.cpf) formData.append('cpf', data.cpf);
    if (data.telefone) formData.append('telefone', data.telefone);
    if (data.data_nascimento) formData.append('data_nascimento', data.data_nascimento);

    const result = isEditing ? await updatePatient(formData) : await createPatient(formData);

    if (result?.success) {
      toast.success(isEditing ? 'Paciente atualizado!' : 'Paciente criado com sucesso!');
      onSuccess();
    } else {
      toast.error(result?.error || 'Por favor, corrija os erros no formulário.');
    }
  };

  return (
    <Form {...form}>
      {/* A tag <form> agora tem o ID que veio das props */}
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="nome" render={({ field }) => (<FormItem><FormLabel>Nome Completo</FormLabel><FormControl><Input placeholder="Nome do paciente" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField
  control={form.control}
  name="cpf"
  render={({ field }) => (
    <FormItem>
      <FormLabel>CPF (Opcional)</FormLabel>
      <FormControl>
        <InputMask
          mask="999.999.999-99"
          value={field.value || ''}
          onChange={field.onChange}
        >
          {/* Envelopamos o Input em uma função que recebe inputProps */}
          {(inputProps: any) => 
            <Input {...inputProps} placeholder="000.000.000-00" />
          }
        </InputMask>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
        <FormField
  control={form.control}
  name="telefone"
  render={({ field }) => (
    <FormItem>
      <FormLabel>WhatsApp / Telefone (Opcional)</FormLabel>
      <FormControl>
        <InputMask
          mask="(99) 99999-9999"
          value={field.value || ''}
          onChange={field.onChange}
        >
          {/* Envelopamos o Input em uma função que recebe inputProps */}
          {(inputProps: any) => 
            <Input {...inputProps} type="tel" placeholder="(99) 99999-9999" />
          }
        </InputMask>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
        <FormField control={form.control} name="data_nascimento" render={({ field }) => ( <FormItem><FormLabel>Data de Nascimento</FormLabel><FormControl><Input type="date" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem> )} />
        {/* O BOTÃO DE SUBMIT FOI REMOVIDO DAQUI */}
      </form>
    </Form>
  );
}