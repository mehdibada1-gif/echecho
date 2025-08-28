'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Line, LineChart, Tooltip } from 'recharts';
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

const timeSeriesData = [
  { month: "Jan", trees: 30, waste: 20 },
  { month: "Feb", trees: 45, waste: 35 },
  { month: "Mar", trees: 60, waste: 50 },
  { month: "Apr", trees: 70, waste: 65 },
  { month: "May", trees: 90, waste: 80 },
  { month: "Jun", trees: 110, waste: 95 },
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
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">
            Impact Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
           <ChartContainer config={{}} className="h-[300px] w-full">
                <LineChart
                    data={timeSeriesData}
                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="trees" stroke="var(--color-chart-1)" strokeWidth={2} name="Trees Planted"/>
                    <Line type="monotone" dataKey="waste" stroke="var(--color-chart-2)" strokeWidth={2} name="Waste Recycled (kg)"/>
                </LineChart>
            </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
