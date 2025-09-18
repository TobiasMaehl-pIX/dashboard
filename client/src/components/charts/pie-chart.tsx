'use client';

import { getChartColors } from '@/lib/colors';
import { ChartData, ChartOptions } from 'chart.js';
import React from 'react';
import { Pie } from 'react-chartjs-2';
import './chart-component-registry'; // Import to register Chart.js components

interface PieChartProps {
  data: ChartData<'pie'>;
}

export const PieChart = React.memo(function PieChart({ data }: PieChartProps) {
  const colors = getChartColors();

  const options: ChartOptions<'pie'> = React.useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right' as const,
          labels: {
            color: colors.mutedForeground,
            usePointStyle: true,
            padding: 20,
          },
        },
        tooltip: {
          backgroundColor: colors.card,
          titleColor: colors.cardForeground,
          bodyColor: colors.cardForeground,
          borderColor: colors.border,
          borderWidth: 1,
        },
      },
    }),
    [colors],
  );

  const chartColors = React.useMemo(
    () => [
      colors.chart1,
      colors.chart2,
      colors.chart3,
      colors.chart4,
      colors.chart5,
    ],
    [colors],
  );

  const styledData = React.useMemo(
    () => ({
      ...data,
      datasets: data.datasets.map((dataset) => ({
        ...dataset,
        backgroundColor: chartColors,
        borderColor: colors.card,
        borderWidth: 2,
      })),
    }),
    [data, chartColors, colors.card],
  );

  return <Pie data={styledData} options={options} />;
});
