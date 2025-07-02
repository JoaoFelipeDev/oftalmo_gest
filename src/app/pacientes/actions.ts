// src/app/pacientes/actions.ts
'use server';

import { supabase } from '@/lib/supabase-client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Schema para criação (sem id)
const patientCreateSchema = z.object({
  nome: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  cpf: z.string().optional(),
  data_nascimento: z.string().optional(),
  telefone: z.string().optional(),
});

// Schema para edição (com id)
const patientUpdateSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  cpf: z.string().optional(),
  data_nascimento: z.string().optional(),
  telefone: z.string().optional(),
});

export async function createPatient(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = patientCreateSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  // 2. Inclua o campo 'telefone' na inserção do Supabase
  const { error } = await supabase.from('pacientes').insert([
    {
      nome: validatedFields.data.nome,
      cpf: validatedFields.data.cpf,
      data_nascimento: validatedFields.data.data_nascimento,
      telefone: validatedFields.data.telefone, // <-- Adicionado
    },
  ]);

  if (error) {
    console.error('Erro do Supabase:', error);
    return { error: 'Erro ao criar o paciente no banco de dados.' };
  }

  revalidatePath('/pacientes');
  return { success: true };
}

export async function updatePatient(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = patientUpdateSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { id, ...patientData } = validatedFields.data;

  const { error } = await supabase
    .from('pacientes')
    .update(patientData) // Usa o método update
    .eq('id', id);      // Onde o ID corresponde

  if (error) {
    console.error('Erro do Supabase ao atualizar:', error);
    return { error: 'Erro ao atualizar o paciente no banco de dados.' };
  }

  revalidatePath('/pacientes');
  return { success: true };
}

