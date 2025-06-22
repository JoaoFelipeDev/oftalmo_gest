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
  nome: z.string().min(3, { message: 'O nome é obrigatório.' }),
  cpf: z.string(),
  telefone: z.string(),
  data_nascimento: z.string(),
});

type PatientFormValues = z.infer<typeof patientSchema>;

// O formulário agora recebe um 'formId'
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
          ...initialData,
          cpf: initialData.cpf ?? '',
          telefone: initialData.telefone ?? '',
          data_nascimento: initialData.data_nascimento ?? '',
        }
      : { nome: '', cpf: '', telefone: '', data_nascimento: '' },
  });

  const isEditing = !!initialData;

  const onSubmit = async (data: PatientFormValues) => {
    const formData = new FormData();
    // Adiciona todos os campos ao FormData para enviar para a Server Action
    if (isEditing && data.id) formData.append('id', data.id);
    formData.append('nome', data.nome);
    if (data.cpf) formData.append('cpf', data.cpf);
    if (data.telefone) formData.append('telefone', data.telefone);
    if (data.data_nascimento) formData.append('data_nascimento', data.data_nascimento);

    const result = isEditing
      ? await updatePatient(formData)
      : await createPatient(formData);

    if (result?.success) {
      toast.success(isEditing ? 'Paciente atualizado!' : 'Paciente criado com sucesso!');
      onSuccess();
    } else {
      toast.error(result?.error || 'Por favor, corrija os erros no formulário.');
    }
  };

  return (
    <Form {...form}>
      {/* O id do formulário agora é passado via props */}
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="nome" render={({ field }) => (<FormItem><FormLabel>Nome Completo</FormLabel><FormControl><Input placeholder="Nome do paciente" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <InputMask
                  mask="999.999.999-99"
                  value={field.value}
                  onChange={field.onChange}
                >
                  {(inputProps: any) => (
                    <Input {...inputProps} placeholder="000.000.000-00" />
                  )}
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
              <FormLabel>WhatsApp / Telefone</FormLabel>
              <FormControl>
                <InputMask
                  mask="(99) 99999-9999"
                  value={field.value}
                  onChange={field.onChange}
                >
                  {(inputProps: any) => (
                    <Input {...inputProps} type="tel" placeholder="(99) 99999-9999" />
                  )}
                </InputMask>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField control={form.control} name="data_nascimento" render={({ field }) => ( <FormItem><FormLabel>Data de Nascimento</FormLabel><FormControl><Input type="date" {...field} value={field.value} /></FormControl><FormMessage /></FormItem> )} />
        
        {/* O BOTÃO DE SUBMIT FOI REMOVIDO DAQUI, ESSA É A MUDANÇA PRINCIPAL */}
      </form>
    </Form>
  );
}