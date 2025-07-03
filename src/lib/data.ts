/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from './supabase-client';

/* ---------- TIPAGENS ---------- */

export interface Patient {
  id: string;
  nome: string;
  cpf: string | null;
  telefone: string | null;
  data_nascimento: string | null;
}

export type PatientConsultation = {
  id: string;
  data_consulta: string;
  procedimento: string;
  status: string;
  medicos: { nome: string } | null;
};

export interface PatientConvenio {
  id: string;
  numero_matricula: string | null;
  plano: string | null;
  convenios: {
    nome: string;
  } | null;
}

export type PatientDetails = Patient & {
  consultas: PatientConsultation[];
  paciente_convenios: PatientConvenio[];
};

export interface Convenio {
  id: string;
  nome: string;
  ativo: boolean;
}

export interface Resource {
  id: string;
  title: string;
}

export interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  resourceId?: string;
}

/* ---------- PACIENTES ---------- */

export async function getPatientCount(): Promise<number> {
  const { count, error } = await supabase
    .from('pacientes')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error("Erro ao contar pacientes:", error.message);
    return 0;
  }

  return count ?? 0;
}

export async function getPaginatedPatients(options: {
  query?: string;
  page?: number;
  limit?: number;
}): Promise<{ patients: Patient[]; pageCount: number }> {
  const { query, page = 1, limit = 10 } = options;

  let supabaseQuery = supabase
    .from('pacientes')
    .select('id, nome, cpf, telefone, data_nascimento', { count: 'exact' });

  if (query) {
    supabaseQuery = supabaseQuery.ilike('nome', `%${query}%`);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  supabaseQuery = supabaseQuery.range(from, to);

  const { data, error, count } = await supabaseQuery;

  if (error) {
    console.error("Erro ao buscar pacientes:", error.message);
    return { patients: [], pageCount: 0 };
  }

  return {
    patients: data || [],
    pageCount: Math.ceil((count ?? 0) / limit),
  };
}

export async function searchPatientsByName(query: string): Promise<{ id: string; nome: string }[]> {
  if (!query || query.length < 2) return [];

  const { data, error } = await supabase
    .from('pacientes')
    .select('id, nome')
    .ilike('nome', `%${query}%`)
    .limit(5);

  if (error) {
    console.error("Erro ao buscar pacientes por nome:", error.message);
    return [];
  }

  return data || [];
}

export async function getPatientDetails(id: string): Promise<PatientDetails | null> {
  const { data, error } = await supabase
    .from('pacientes')
    .select(`
      *,
      consultas (id, data_consulta, procedimento, status, medicos ( nome )),
      paciente_convenios ( id, numero_matricula, plano, convenios ( nome ) )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error("Erro ao buscar detalhes do paciente:", error.message);
    return null;
  }

  return data as any;
}

/* ---------- CONVÊNIOS ---------- */

export async function getConvenios(): Promise<Convenio[]> {
  const { data, error } = await supabase
    .from('convenios')
    .select('id, nome, ativo')
    .order('nome', { ascending: true });

  if (error) {
    console.error("Erro ao buscar convênios:", error.message);
    return [];
  }

  return data || [];
}

export async function getAllConvenios(): Promise<Convenio[]> {
  const { data, error } = await supabase
    .from('convenios')
    .select('id, nome, ativo')
    .eq('ativo', true)
    .order('nome', { ascending: true });

  if (error) {
    console.error("Erro ao buscar lista de convênios:", error.message);
    return [];
  }

  return data || [];
}

export async function getConveniosByPatientId(patientId: string): Promise<PatientConvenio[]> {
  if (!patientId) return [];

  const { data, error } = await supabase
    .from('paciente_convenios')
    .select(`
      id,
      numero_matricula,
      plano,
      convenios ( nome ) 
    `)
    .eq('paciente_id', patientId);

  if (error) {
    console.error("Erro ao buscar convênios do paciente:", error.message);
    return [];
  }

  return (data || []).map(item => ({
    ...item,
    convenios: Array.isArray(item.convenios) ? item.convenios[0] ?? null : item.convenios
  }));
}

/* ---------- CONSULTAS ---------- */

export async function getConsultationsCount(): Promise<number> {
  const { count, error } = await supabase
    .from('consultas')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Realizada');

  if (error) {
    console.error("Erro ao contar consultas:", error.message);
    return 0;
  }

  return count ?? 0;
}

export async function getTotalRevenue(): Promise<number> {
  const { data, error } = await supabase
    .from('consultas')
    .select('valor');

  if (error) {
    console.error("Erro ao buscar faturamento:", error.message);
    return 0;
  }

  if (!data) return 0;

  return data.reduce((acc, consulta) => acc + (consulta.valor || 0), 0);
}

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

  return (data || []).map(item => {
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
}

/* ---------- MÉDICOS ---------- */

export async function getDoctorsAsResources(): Promise<Resource[]> {
  const { data, error } = await supabase
    .from('medicos')
    .select('id, nome');

  if (error) {
    console.error("Erro ao buscar médicos:", error.message);
    return [];
  }

  return data ? data.map(medico => ({ id: medico.id, title: medico.nome })) : [];
}

/* ---------- DASHBOARD ---------- */

export async function getDailyRevenueData() {
  const { data, error } = await supabase.rpc('get_daily_revenue_last_7_days');

  if (error) {
    console.error("Erro ao buscar dados do gráfico de faturamento:", error.message);
    return [];
  }

  return data;
}

export async function getPaymentMethodDistribution() {
  const { data, error } = await supabase.rpc('get_payment_method_distribution');

  if (error) {
    console.error("Erro ao buscar dados do gráfico de métodos de pagamento:", error.message);
    return [];
  }

  return data;
}
