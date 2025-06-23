/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/agenda/actions.ts
'use server';

import { supabase } from '@/lib/supabase-client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const consultationSchema = z.object({
  data_consulta: z.string({ required_error: 'A data da consulta é obrigatória.' }),
  horario: z.string({ required_error: 'A hora é obrigatória.' }),
  paciente_id: z.string({ required_error: 'Selecione um paciente.' }),
  medico_id: z.string({ required_error: 'Selecione um médico.' }),
  procedimento: z.string().min(3, 'Descreva o procedimento.'),
  valor: z.string().optional(),
  status: z.string(),
});

export async function createConsultation(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  console.log('Dados recebidos:', rawData);
  const validatedFields = consultationSchema.safeParse(rawData);

  if (!validatedFields.success) {
    console.error(validatedFields.error.flatten().fieldErrors);
    return { error: 'Dados inválidos. Por favor, verifique o formulário.' };
  }
    const { data_consulta, horario, ...rest } = validatedFields.data;
  // Pega a data (ex: '2025-06-20T03:00:00.000Z') e extrai apenas a parte da data 'YYYY-MM-DD'
  const datePart = data_consulta.split('T')[0];
  // Junta a data com a hora para formar um timestamp completo (ex: '2025-06-20 14:30')
  const fullTimestamp = `${datePart} ${horario}`;
  // --- FIM DA LÓGICA ---
const valorNumerico = rest.valor ? parseFloat(rest.valor.replace(',', '.')) : null;

  const { error } = await supabase.from('consultas').insert([
    {
      data_consulta: fullTimestamp, 
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