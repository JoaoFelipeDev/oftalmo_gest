// src/app/pacientes/[id]/actions.ts
'use server';

import { supabase } from '@/lib/supabase-client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const linkConvenioSchema = z.object({
    paciente_id: z.string().uuid(),
    convenio_id: z.string({ required_error: "Selecione um convênio." }),
    plano: z.string().optional(),
    numero_matricula: z.string().optional(),
});

// Definimos o tipo para o estado que a nossa ação vai retornar
type ActionState = {
    error: string | null;
    success: string | null;
}

// --- CORREÇÃO PRINCIPAL AQUI ---
// A função agora aceita 'prevState' como primeiro argumento, como o hook useFormState espera.
export async function linkConvenioToPatient(
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const rawData = {
        paciente_id: formData.get('paciente_id'),
        convenio_id: formData.get('convenio_id'),
        plano: formData.get('plano'),
        numero_matricula: formData.get('numero_matricula'),
    };

    const validatedFields = linkConvenioSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: "Dados inválidos.", success: null };
    }

    const { error } = await supabase.from('paciente_convenios').insert([validatedFields.data]);

    if (error) {
        return { error: `Erro ao vincular convênio: ${error.message}`, success: null };
    }

    // Revalida a página de detalhes do paciente para mostrar o novo convênio
    revalidatePath(`/pacientes/${validatedFields.data.paciente_id}`);
    return { success: "Convênio vinculado com sucesso!", error: null };
}