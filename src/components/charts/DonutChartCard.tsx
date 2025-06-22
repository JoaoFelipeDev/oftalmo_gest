// src/components/charts/DonutChartCard.tsx
'use client';

import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Interface para os dados que o gráfico recebe
interface DonutChartCardProps {
  data: {
    name: string;
    value: number;
  }[];
}

// Mapa de cores para deixar o gráfico mais bonito
const COLOR_MAP: { [key: string]: string } = {
  'Boleto Bancário': '#3B82F6', // Azul
  'Dinheiro': '#F59E0B',      // Amarelo/Laranja
  'PIX': '#10B981',         // Verde
  'Promissórias': '#6366F1', // Indigo/Roxo
  'Cartão de Crédito': '#EC4899', // Rosa
  'Não definido': '#6B7280', // Cinza
};

export function DonutChartCard({ data }: DonutChartCardProps) {
  // Adiciona a propriedade de cor a cada item de dados
  const chartData = data.map(entry => ({
    ...entry,
    fill: COLOR_MAP[entry.name] || '#A1A1AA', // Usa a cor do mapa ou um cinza padrão
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Formas de recebimento populares</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    contentStyle={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem"
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 'bold' }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    label={(props) => `${(props.percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-sm">
              {chartData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.fill }} />
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="h-[380px] flex items-center justify-center">
            <p className="text-muted-foreground">Sem dados de pagamento para exibir.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}