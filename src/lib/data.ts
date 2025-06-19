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

export async function getConsultationsForCalendar() {
  const { data, error } = await supabase
    .from('consultas')
    .select(`
      id,
      data_consulta,
      procedimento,
      pacientes ( nome ),
      medicos ( nome )
    `);
  
  if (error) {
    console.error("Erro ao buscar consultas:", error.message);
    return [];
  }

  if (!data) {
    return [];
  }

  // Dizemos ao TypeScript que 'data' é uma lista do nosso tipo 'ConsultaComNomes'
  const typedData = data as ConsultaComNomes[];

  return typedData.map(item => {
    const startTime = new Date(item.data_consulta);
    const endTime = new Date(startTime.getTime() + 30 * 60000); 
    
    // --- LÓGICA DE ACESSO CORRIGIDA ---
    // Verificamos se a lista existe e tem pelo menos um item antes de acessar o nome.
    const patientName = (item.pacientes && item.pacientes.length > 0)
      ? item.pacientes[0].nome
      : 'Paciente';
    
    const doctorName = (item.medicos && item.medicos.length > 0)
      ? item.medicos[0].nome
      : undefined;

    return {
      title: `${item.procedimento} - ${patientName}`,
      start: startTime,
      end: endTime,
      resource: doctorName,
    };
  });
}