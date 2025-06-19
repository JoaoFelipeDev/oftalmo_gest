// src/components/charts/BarChartCard.tsx
'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// O componente agora recebe os dados como uma propriedade (prop)
interface BarChartCardProps {
  data: {
    date: string;
    entradas: number;
  }[];
}

export function BarChartCard({ data }: BarChartCardProps) {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Faturamento por Dia (Últimos 7 Dias)</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$${value}`} // Formata o eixo Y como moeda
            />
           <Tooltip
  wrapperClassName="!rounded-lg"
  contentStyle={{
    backgroundColor: "hsl(var(--background))",
    borderColor: "hsl(var(--border))",
  }}
  labelStyle={{
    fontWeight: 'bold',
    color: "hsl(var(--foreground))"
  }}
  // --- ADICIONE ESTA PROPRIEDADE ---
  itemStyle={{
    color: "hsl(var(--foreground))"
  }}
  // --- FIM DA ADIÇÃO ---
  formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
  cursor={{ fill: "hsl(var(--muted))" }}
/>
            <Bar dataKey="entradas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}