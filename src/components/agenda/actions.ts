// src/app/agenda/actions.ts
'use server';

import { supabase } from '@/lib/supabase-client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const consultationSchema = z.object({
  data_consulta: z.string({ required_error: 'A data da consulta é obrigatória.' }),
  paciente_id: z.string({ required_error: 'Selecione um paciente.' }),
  medico_id: z.string({ required_error: 'Selecione um médico.' }),
  procedimento: z.string().min(3, 'Descreva o procedimento.'),
  valor: z.string().optional(),
  status: z.string(),
});

export async function createConsultation(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = consultationSchema.safeParse(rawData);

  if (!validatedFields.success) {
    console.error(validatedFields.error.flatten().fieldErrors);
    return { error: 'Dados inválidos. Por favor, verifique o formulário.' };
  }
  
  const valorNumerico = validatedFields.data.valor 
    ? parseFloat(validatedFields.data.valor.replace(',', '.')) 
    : null;

  const { error } = await supabase.from('consultas').insert([
    {
      data_consulta: validatedFields.data.data_consulta,
      paciente_id: validatedFields.data.paciente_id,
      medico_id: validatedFields.data.medico_id,
      procedimento: validatedFields.data.procedimento,
      valor: valorNumerico,
      status: validatedFields.data.status,
    },
  ]);

  if (error) {
    console.error('Erro do Supabase:', error);
    return { error: 'Erro ao criar a consulta no banco de dados.' };
  }

  revalidatePath('/agenda');
  return { success: true };
}