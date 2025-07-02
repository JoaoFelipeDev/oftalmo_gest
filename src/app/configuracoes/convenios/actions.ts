// src/app/configuracoes/convenios/actions.ts
'use server';

import { supabase } from '@/lib/supabase-client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// O schema de validação permanece o mesmo
const convenioSchema = z.object({
    nome: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
    ativo: z.boolean(),
});

// --- CORREÇÃO PRINCIPAL AQUI ---
// A função agora aceita 'prevState' como o primeiro argumento, como o useFormState espera.
export async function createConvenio(
    prevState: { error: string | null; success: string | null },
    formData: FormData
) {
    const rawData = {
        nome: formData.get('nome'),
        ativo: formData.get('ativo') === 'true',
    };

    const validatedFields = convenioSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: "Dados inválidos.", success: null };
    }

    const { error } = await supabase.from('convenios').insert([validatedFields.data]);

    if (error) {
        console.error("Erro do Supabase:", error);
        return { error: "Erro ao criar o convênio.", success: null };
    }

    revalidatePath('/configuracoes/convenios');
    return { success: "Convênio criado com sucesso!", error: null };
}

// A função de update permanece a mesma por enquanto
export async function updateConvenioStatus(id: string, novoStatus: boolean) {
    const { error } = await supabase
        .from('convenios')
        .update({ ativo: novoStatus })
        .eq('id', id);

    if (error) {
        return { error: "Erro ao atualizar o status do convênio." };
    }

    revalidatePath('/configuracoes/convenios');
    return { success: "Status atualizado com sucesso!" };
}