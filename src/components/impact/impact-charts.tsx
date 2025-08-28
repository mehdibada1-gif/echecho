
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartContainer,
} from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const chartData = [
  { country: 'Italy', contributions: 275 },
  { country: 'Netherlands', contributions: 200 },
  { country: 'Sweden', contributions: 187 },
  { country: 'Lebanon', contributions: 173 },
  { country: 'Tunisia', contributions: 90 },
  { country: 'Morocco', contributions: 120 },
];

export function ImpactCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">
            Contributions by Country
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-[300px] w-full">
            <BarChart data={chartData} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="country"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="contributions" fill="var(--color-chart-1)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
