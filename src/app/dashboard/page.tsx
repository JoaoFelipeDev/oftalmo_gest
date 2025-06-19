// src/app/dashboard/page.tsx

import { DashboardCard } from "@/components/shared/DashboardCard";
import { BarChartCard } from "@/components/charts/BarChartCard";
import { DonutChartCard } from "@/components/charts/DonutChartCard";
// 1. Importe a nova função
import { getPatientCount, getTotalRevenue, getConsultationsCount, getDailyRevenueData, getPaymentMethodDistribution } from "@/lib/data";
import { DollarSign, Users, CreditCard, Activity } from "lucide-react";

export const revalidate = 0;

export default async function DashboardPage() {
  
  // 2. Adicione a nova chamada de função para ser executada em paralelo
  const patientCountPromise = getPatientCount();
  const totalRevenuePromise = getTotalRevenue();
  const consultationsCountPromise = getConsultationsCount();
  const dailyRevenuePromise = getDailyRevenueData();
  const paymentDistributionPromise = getPaymentMethodDistribution();

  const [
    patientCount, 
    totalRevenue, 
    consultationsCount,
    dailyRevenueData,
    paymentDistributionData 
  ] = await Promise.all([
    patientCountPromise,
    totalRevenuePromise,
    consultationsCountPromise,
    dailyRevenuePromise,
    paymentDistributionPromise
  ]);

  const formattedRevenue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(totalRevenue);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <DashboardCard 
          title="Faturamento Total"
          value={formattedRevenue}
          description="+20.1% em relação ao mês passado"
          icon={DollarSign}
        />
        <DashboardCard 
          title="Pacientes Cadastrados"
          value={patientCount.toString()}
          description="Total de pacientes na base"
          icon={Users}
        />
        {/* 3. Use a nova variável no card de Consultas */}
        <DashboardCard 
          title="Consultas Realizadas"
          value={consultationsCount.toString()}
          description="Total de consultas realizadas"
          icon={CreditCard}
        />
        <DashboardCard 
          title="Taxa de Confirmação"
          value="92%" // Este ainda é um dado estático
          description="Média dos últimos 30 dias"
          icon={Activity}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <BarChartCard data={dailyRevenueData}/>
        <DonutChartCard data={paymentDistributionData} />
      </div>
    </div>
  );
}