/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/configuracoes/convenios/actions.ts
'use server';

import { supabase } from '@/lib/supabase-client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Schema para criação e atualização
const convenioSchema = z.object({
    id: z.string().uuid("ID inválido.").optional(),
    nome: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
    ativo: z.boolean(),
});

export async function createConvenio(
    prevState: { error: string | null, success: string | null },
    formData: FormData
) {
    const rawData = {
        nome: formData.get('nome'),
        ativo: formData.get('ativo') === 'true',
    };

    const validatedFields = convenioSchema.omit({ id: true }).safeParse(rawData);

    if (!validatedFields.success) {
        return { error: "Dados inválidos.", success: null };
    }

    const { error } = await supabase.from('convenios').insert([validatedFields.data]);

    if (error) {
        return { error: `Erro ao criar o convênio: ${error.message}`, success: null };
    }

    revalidatePath('/configuracoes/convenios');
    return { success: "Convênio criado com sucesso!", error: null };
}

export async function updateConvenio(prevState: any,
    formData: FormData) {
    const rawData = {
        id: formData.get('id'),
        nome: formData.get('nome'),
        ativo: formData.get('ativo') === 'true',
    };

    const validatedFields = convenioSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: "Dados inválidos.", success: null };
    }

    const { id, ...convenioData } = validatedFields.data;

    const { error } = await supabase
        .from('convenios')
        .update(convenioData)
        .eq('id', id!);

    if (error) {
        return { error: `Erro ao atualizar o convênio: ${error.message}`, success: null };
    }

    revalidatePath('/configuracoes/convenios');
    return { success: "Convênio atualizado com sucesso!", error: null };
}

export async function deleteConvenio(id: string) {
    if (!id) {
        return { error: "ID do convênio é necessário." };
    }

    const { error } = await supabase
        .from('convenios')
        .delete()
        .eq('id', id);

    if (error) {
        return { error: `Erro ao deletar o convênio: ${error.message}` };
    }

    revalidatePath('/configuracoes/convenios');
    return { success: "Convênio deletado com sucesso!" };
}
export async function updateConvenioStatus(id: string, novoStatus: boolean) {
    const { error } = await supabase
        .from('convenios')
        .update({ ativo: novoStatus })
        .eq('id', id);

    if (error) {
        return { error: `Erro ao atualizar o status: ${error.message}` };
    }

    revalidatePath('/configuracoes/convenios');
    return { success: "Status atualizado com sucesso!" };
}