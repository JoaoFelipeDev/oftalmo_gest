/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/lib/data.ts

import { supabase } from './supabase-client';

export async function getPatientCount(): Promise<number> {
  // Adicionamos logs para ver o que está acontecendo
  console.log("--- DEBUG: INICIANDO BUSCA DE CONTAGEM DE PACIENTES ---");

  const { count, error } = await supabase
    .from('pacientes')
    .select('*', { count: 'exact', head: true });

  // Se houver um erro, vamos imprimi-lo no console do servidor
  if (error) {
    console.error("--- DEBUG: ERRO DO SUPABASE:", error.message);
    return 0;
  }

  // Se não houver erro, vamos imprimir a contagem que recebemos
  console.log("--- DEBUG: CONTAGEM RECEBIDA DO SUPABASE:", count);

  return count ?? 0;
}

export async function getTotalRevenue(): Promise<number> {
  // Seleciona apenas a coluna 'valor' da tabela 'consultas'
  const { data, error } = await supabase
    .from('consultas')
    .select('valor');
    console.log("--- DEBUG: CONTAGEM RECEBIDA DO SUPABASE:", data);
  if (error) {
    console.error("Erro ao buscar faturamento:", error.message);
    return 0;
  }

  // Se não houver dados, retorna 0
  if (!data) {
    return 0;
  }

  // Soma todos os valores da coluna 'valor' usando o método reduce
  const total = data.reduce((acc, consulta) => acc + (consulta.valor || 0), 0);
  
  return total;
}

export async function getConsultationsCount(): Promise<number> {
  // ATENÇÃO: Assumindo que o status 'Realizada' é como você salva no banco.
  // Ajuste o texto se o nome do seu status for diferente (ex: 'Concluída').
  const { count, error } = await supabase
    .from('consultas')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Realizada'); // Filtramos apenas as consultas com status 'Realizada'

  if (error) {
    console.error("Erro ao buscar contagem de consultas:", error.message);
    return 0;
  }

  return count ?? 0;
}

export async function getDailyRevenueData() {
  // Chamamos a função do banco de dados usando 'rpc'
  const { data, error } = await supabase.rpc('get_daily_revenue_last_7_days');

  if (error) {
    console.error("Erro ao buscar dados do gráfico de faturamento:", error.message);
    return [];
  }

  // O Supabase já retorna os dados no formato que o gráfico precisa
  return data;
}

export async function getPaymentMethodDistribution() {
  const { data, error } = await supabase.rpc('get_payment_method_distribution');

  console.log("--- DEBUG: DADOS DO GRÁFICO DE PIZZA RECEBIDOS:", data);

  if (error) {
    console.error("Erro ao buscar dados do gráfico de pizza:", error.message);
    return [];
  }
  return data;
}

type ConsultaComNomes = {
  id: string;
  data_consulta: string;
  procedimento: string;
  pacientes: { nome: string }[] | null;
  medicos: { nome: string }[] | null;
};

export async function getConsultationsForCalendar(): Promise<CalendarEvent[]> {
  const { data, error } = await supabase
    .from('consultas')
    .select(`
      id,
      data_consulta,
      procedimento,
      medico_id,
      pacientes ( nome )
    `);
  
  if (error) {
    console.error("Erro ao buscar consultas para a agenda:", error.message);
    return [];
  }

  if (!data) {
    return [];
  }

  const events = data.map(item => {
    // --- A CORREÇÃO ESTÁ AQUI ---
    // Agora usamos new Date() diretamente. Como o banco de dados não tem mais
    // informação de fuso horário, o JavaScript vai interpretar a data
    // como sendo no fuso horário local do servidor/ambiente, que é o comportamento que queremos.
    const startTime = new Date(item.data_consulta);
    const endTime = new Date(startTime.getTime() + 30 * 60000); 
    
    const patient = item.pacientes as any;

    return {
      title: `${item.procedimento} - ${patient?.nome || 'Paciente'}`,
      start: startTime,
      end: endTime,
      resourceId: item.medico_id,
    };
  });

  return events;
}
export interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  resourceId?: string; // ID do médico para o calendário saber em qual coluna colocar o evento
}
export interface Resource {
  id: string;
  title: string;
}



export async function getDoctorsAsResources(): Promise<Resource[]> {
  const { data, error } = await supabase.from('medicos').select('id, nome');

  if (error) {
    console.error("Erro ao buscar médicos:", error.message);
    return [];
  }
  
  return data ? data.map(medico => ({ id: medico.id, title: medico.nome })) : [];
}

export interface Patient {
  id: string;
  nome: string;
  cpf: string | null;
  telefone: string | null; // Adicionando o campo telefone
  data_nascimento: string | null;
}

export type PatientConsultation = {
  id: string;
  data_consulta: string;
  procedimento: string;
  status: string;
  medicos: { nome: string } | null;
}

// O tipo de retorno agora inclui o paciente E sua lista de consultas
export type PatientDetails = Patient & {
  consultas: PatientConsultation[];
}

export async function getPaginatedPatients(options: {
  query?: string;
  page?: number;
  limit?: number;
}): Promise<{ patients: Patient[], pageCount: number }> {
  const { query, page = 1, limit = 10 } = options;

  let supabaseQuery = supabase
    .from('pacientes')
    .select('id, nome, cpf, telefone, data_nascimento', { count: 'exact' });

  // Adiciona o filtro de busca se houver uma query
  if (query) {
    supabaseQuery = supabaseQuery.ilike('nome', `%${query}%`);
  }

  // Lógica da paginação
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  supabaseQuery = supabaseQuery.range(from, to);

  const { data, error, count } = await supabaseQuery;

  if (error) {
    console.error("Erro ao buscar pacientes:", error.message);
    return { patients: [], pageCount: 0 };
  }

  const pageCount = Math.ceil((count ?? 0) / limit);

  return { patients: data || [], pageCount };
}

export async function searchPatientsByName(query: string): Promise<{ id: string; nome: string }[]> {
  if (!query || query.length < 2) {
    return [];
  }
  
  const { data, error } = await supabase
    .from('pacientes')
    .select('id, nome')
    .ilike('nome', `%${query}%`) // ilike é case-insensitive
    .limit(5); // Limitamos a 5 resultados

  if (error) {
    console.error("Erro ao buscar pacientes por nome:", error.message);
    return [];
  }

  return data || [];
}
export async function getPatientDetails(id: string): Promise<PatientDetails | null> {
  // O select agora busca '*' (todos os campos) da tabela pacientes E também
  // todos os campos da tabela de consultas relacionadas, incluindo o nome do médico.
  const { data, error } = await supabase
    .from('pacientes')
    .select(`
      *,
      consultas (id, data_consulta, procedimento, status, medicos ( nome ))
    `)
    .eq('id', id)
    .single(); // .single() garante que esperamos apenas um resultado

  if (error) {
    console.error("Erro ao buscar detalhes do paciente:", error.message);
    return null;
  }

  return data as PatientDetails;
}

